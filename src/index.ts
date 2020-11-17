import Telegraf from 'telegraf';
import { load } from 'ts-dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import sourceMasourpSupport from 'source-map-support';
import cors from 'cors';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import routes from './routes';
import botHandler from './bot-handler';
import db from './db';
import { BASE_URL } from './constants';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Jakarta');

sourceMasourpSupport.install();

const env = load({
  TELEGRAF: String,
  KATA_TOKEN: String,
  KATA_NL_ID: String
});

const bot = new Telegraf(env.TELEGRAF);
let isRunning = false;

const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

app.use(routes);

botHandler(bot);

app.get('/', async (req, res) => {
  return res.send({
    status: 'ok'
  });
});

app.get('/api/start-exam/:examId', async (req, res) => {
  const { examId } = req.params;

  // Send message to student
  // Get Exam by Id
  const exam = db.get('examProblem').find({ id: examId }).value();

  // Get Group by group id inside exam
  const group = db.get('groups').find({ groupId: exam.groupId }).value();
  // Broadcast -> Group.student
  if (!group.students) {
    return res.status(404).send({
      error: 'student not found'
    });
  }

  const promises = group.students.map((student) => {
    return bot.telegram.sendMessage(
      student.id || '',
      `Hai, ujian ${exam.title} telah dimulai, silahkan gunakan link berikut untuk mengikuti ujian ${BASE_URL}/ujian/${examId}/${group.groupId}/${student.id}`
    );
  });

  await Promise.all(promises);

  await bot.telegram.sendMessage(
    group.groupId,
    `Hai, ujian ${exam.title} telah dimulai, pastikan kamu telah menggunakan chatbot Pak Suy ya.\n\nPak Suy sudah mengirimkan URL ujian via japri.`
  );

  return res.send({
    status: 'ok'
  });
});

app.post('/api/submit-exam', async (req, res) => {
  const { body } = req;

  const exists = db
    .get('examAnswer')
    // .find({ examId: parseInt(body.examId, 10), studenId: parseInt(body.studentId, 10) })
    .find({ examId: body.examId, studentId: body.studentId })
    .value();

  const group = db.get('groups').find({ groupId: body.groupId }).value();
  const student = group.students?.find((stud) => stud.id === body.studentId);

  if (student?.parentId) {
    let countChoice = 0;
    let countEssay = 0;
    // @ts-ignore
    body.problems.forEach((problem) => {
      if (problem.answers.length) {
        countChoice += 1;
        return;
      }
      countEssay += 1;
    });
    await bot.telegram.sendMessage(
      student?.parentId,
      `Hai!\nAnak anda telah mengikuti ujian ${body.title} dan menjawab dengan benar ${
        body.correctAnswerCount
      } dari ${countChoice} soal${
        countEssay ? ` dan ${countEssay} soal essay akan diperiksa guru terlebih dahulu` : ''
      }`
    );

    await bot.telegram.sendMessage(
      group.groupId,
      `${student.firstName} telah menyelesaikan ujian ${body.title}!`
    );
  }

  if (exists) return res.send({ status: 'already submited!' });

  db.get('examAnswer').push(body).write();
  return res.send({ status: 'ok' });
});

if (!isRunning) {
  bot.launch().then(() => console.log('Bot Running...'));
  isRunning = true;
}

const checkReminder = () => {
  const reminders = db
    .get('reminder')
    .filter((item) => !item.isNotified && dayjs(item.date, 'YYYY-MM-DD').diff(dayjs(), 'h') <= 24)
    .value();

  reminders.forEach(async (reminder) => {
    // Send notif
    const group = db.get('groups').find({ groupId: reminder.groupId }).value();

    let parentMsg =
      'Hai, Orang tua siswa. Saya mau mengingatkan besok anak anda ada ujian, mohon diingatkan untuk belajar 🥇';
    let groupMsg = 'Jangan lupa ya besok kita ada ujian 😄';
    let studentMsg = 'Hai, jangan lupa belajar ya, besok ada ujian 😁';

    db.get('reminder').find(reminder).assign({ isNotified: true }).write();

    if (reminder.type === 'tugas') {
      groupMsg = 'Jangan lupa ya besok harus mengumpulkan tugas 🙏';
      parentMsg =
        'Hai, Orang tua siswa. Anak anda besok harus mengumpulkan tugas, mohon diingatkan untuk dikerjakan ya 🏆';
      studentMsg = 'Hai, jangan lupa ya besok ada tugas yang harus dikumpulkan';
    }
    console.log('--------------------');
    console.log('Sending reminder: ', reminder.groupId);
    await bot.telegram.sendMessage(group.groupId, groupMsg);
    group.students?.forEach(async (student) => {
      console.log('Sending reminder to student & parent: ', student.id, ' - ', student.parentId);
      await bot.telegram.sendMessage(student.id || '', studentMsg);
      await bot.telegram.sendMessage(student.parentId || '', parentMsg);
    });
  });

  console.log(reminders);
};

app.get('/run-cron', (req, res) => {
  checkReminder();
  res.send({
    status: 'cron running'
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Api Running - Port: ${port}`);
});
