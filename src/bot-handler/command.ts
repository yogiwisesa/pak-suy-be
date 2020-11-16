import { TelegrafContext } from 'telegraf/typings/context';
import { Group, Student, Teacher } from '../types';
import db from '../db';
import { BASE_URL } from '../constants';

export const handleGroupChatCreated = (ctx: TelegrafContext) => {
  ctx.reply(
    `Halo, Aku Pak Suy, terimakasih sudah mengajak Aku gabung di grup ya!\n\nAku akan bantu proses belajar-mengajar grup kelas kalian😄`
  );
};

export const handleBukuCatatan = (ctx: TelegrafContext) => {
  const { message } = ctx;

  const groupId = message?.chat.id;

  const url = `${BASE_URL}/catatan/${groupId}`;
  ctx.reply(`Buku catatan bisa kamu akses melalui: ${url}`);
};

export const handleGuru = (ctx: TelegrafContext) => {
  const { message } = ctx;

  if (!message?.chat.id) return;

  const findClass = db.get('groups').find({ groupId: message?.chat.id }).value();

  const teacher: Teacher = {
    username: message?.from?.username,
    firstName: message?.from?.first_name,
    lastName: message?.from?.last_name,
    id: message?.from?.id
  };

  const group: Group = {
    groupId: message?.chat.id,
    groupName: message?.chat.title,
    teacher
  };

  if (findClass) {
    db.get('groups').find({ groupId: message?.chat.id }).assign(group).write();
    ctx.reply(`Guru berhasil diperbaharui!`, { reply_to_message_id: message?.message_id });
  } else {
    db.get('groups').push(group).write();
    ctx.reply(`Guru telah diatur!`, { reply_to_message_id: message?.message_id });
  }
};

export const handleIdKu = (ctx: TelegrafContext) => {
  ctx.reply(`ID kamu: ${ctx.message?.from?.id}`, { reply_to_message_id: ctx.message?.message_id });
};

export const handleOrtu = async (ctx: TelegrafContext) => {
  const { message } = ctx;
  const parentId = parseInt(message?.text?.replace('/ortu', '') || '', 10);
  if (!parentId) {
    await ctx.reply('Mohon sertakan ID orang tua mu ya 😄', {
      reply_to_message_id: ctx.message?.message_id
    });
    return;
  }

  if (!message?.chat.id) return;

  const student: Student = {
    username: message?.from?.username,
    firstName: message?.from?.first_name,
    lastName: message?.from?.last_name,
    id: message?.from?.id,
    parentId
  };

  const findClass = db.get('groups').find({ groupId: message?.chat.id }).value();

  if (!findClass) {
    ctx.reply(
      'Guru dari kelas ini belum diatur, mohon untuk bapak ibu guru mengirimkan pesan "/guru"'
    );

    ctx.reply('Tolong kirim ulang setelah guru diatur ya 🙏', {
      reply_to_message_id: ctx.message?.message_id
    });
  } else {
    let students: Student[] = [];
    if (Array.isArray(findClass.students)) {
      students = findClass.students;
    }
    const studentIndex = students.findIndex((item) => item.id === student.id);

    let newStudents;
    if (studentIndex < 0) {
      newStudents = [...students, student];
      console.log('User created!');
    } else {
      students[studentIndex] = student;
      newStudents = findClass.students;
      console.log('User udpated!');
    }

    db.get('groups').find({ groupId: message?.chat.id }).assign({ students: newStudents }).write();
    ctx.reply('Berhasil dicatat 😄', { reply_to_message_id: ctx.message?.message_id });

    if (!message.text) return;

    ctx.telegram.sendMessage(
      parseInt(message.text?.replace('/ortu', '').trim(), 10),
      `Halo, Anda ditambahkan sebagai orang tua ${message.from?.first_name}`
    );
  }
};

export const handleAturUjian = async (ctx: TelegrafContext) => {
  const { message } = ctx;

  const guruid = message?.from?.id;

  if (!guruid) return;

  const url = `${BASE_URL}/atur-ujian/${guruid}`;
  ctx.reply(`Kamu bisa mengatur ujian melalui: ${url}`);
};
