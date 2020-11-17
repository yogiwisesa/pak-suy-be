import { TelegrafContext } from 'telegraf/typings/context';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import qs from 'qs';
// @ts-ignore
import et from 'extract-tanggal';

import { KataPredict } from '../api';
import { FollowUpQueue, Note, NoteRoot } from '../types';
import db from '../db';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Jakarta');

const followUpQueue: FollowUpQueue = {};

export const handleCatat = async (ctx: TelegrafContext) => {
  const { message } = ctx;
  if (!message) return;

  const { chat } = message;

  // If chat replied with only '#catat' save the prev message
  // if not only '#catat' save the new message
  const note: Note = {
    from: message.from?.first_name,
    body: message.text?.replace('#catat', '').trim()
  };

  const { id: groupId } = chat;

  const date = dayjs().format('YYYY-MM-DD');
  const findByDate = db.get('notes').find({ date, groupId }).value();
  if (!findByDate) {
    const noteRoot: NoteRoot = {
      groupName: chat.title,
      groupId: chat.id,
      date,
      notes: [note]
    };

    db.get('notes').push(noteRoot).write();
  } else {
    if (!findByDate.notes) return;
    const newNotes: Note[] = [...findByDate.notes, note];

    db.get('notes').find({ date }).assign({ notes: newNotes }).write();
  }

  ctx.reply('Sudah aku catat ya 🙂', { reply_to_message_id: message.message_id });
};

export const handleKata = async (ctx: TelegrafContext) => {
  const { message } = ctx;
  if (!message) return;

  const { message_id: messageId, text } = message;

  if (!text) return;

  console.log(`Handle kata for message id: ${messageId}`);

  const { data } = await KataPredict(text);

  console.log(JSON.stringify(data));

  if (data.result?.question.length && data.result?.question[0].label === 'question') {
    // Follow up later
    const key = messageId.toString();
    const msg = 'Hai, pertanyaan ini belum terjawab. Tolong bantu dijawab yaa 😄';
    followUpQueue[key] = setTimeout(() => {
      ctx.reply(msg, { reply_to_message_id: messageId });
    }, 6000);
  }

  if (data.result?.search_wiki.length && data.result?.search_wiki[0].value !== '?') {
    const query = {
      q: data.result?.search_wiki[0].value
    };
    const foundUrl = `https://www.google.com/search?${qs.stringify(query)}`;
    ctx.reply(`Hmm, sepertinya aku menemukan sesuatu di google: ${foundUrl}`, {
      reply_to_message_id: messageId
    });
  }

  const time = data.result?.kata.find((item) => item.label === 'DATETIME');
  const isTugas =
    text.toLowerCase().includes('tugas') ||
    text.includes('PR') ||
    text.toLowerCase().includes('pekerjaan rumah') ||
    text.toLowerCase().includes('assignment');
  const isUjian =
    text.toLowerCase().includes('ujian') ||
    text.toLowerCase().includes('kuis') ||
    text.toLowerCase().includes('pemantapan') ||
    text.includes('UAS');

  if (data.result?.kata.length && time && (isTugas || isUjian)) {
    const date = et(text.toLowerCase());
    console.log('Reminder date: ', dayjs(date.DateExtracted, 'YYYY-MM-DD').tz('Asia/Jakarta'));
    console.log('Current date: ', dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'));
    if (
      dayjs(date.DateExtracted, 'YYYY-MM-DD').tz('Asia/Jakarta').isAfter(dayjs().tz('Asia/Jakarta'))
    ) {
      console.log('Create reminder');
      ctx.reply(`Pengingat sudah dijadwalkan! akan aku ingatkan di H-1 ya 👍`, {
        reply_to_message_id: messageId
      });
      db.get('reminder')
        .push({
          groupId: message.chat.id,
          date: date.DateExtracted,
          isNotified: false,
          type: isTugas ? 'tugas' : 'ujian'
        })
        .write();
    } else {
      console.log('Date passed.');
    }
  }
};

export default async (ctx: TelegrafContext) => {
  const { message } = ctx;
  if (!message?.text) {
    return null;
  }

  if (message?.reply_to_message) {
    if (followUpQueue[message.reply_to_message.message_id]) {
      clearTimeout(followUpQueue[message.reply_to_message.message_id]);
      console.log(`Queue for ${message.reply_to_message.message_id} cleared!`);
    }
  }

  const isCatat = message?.text?.includes('#catat');
  if (isCatat) {
    handleCatat(ctx);
    return 'catat';
  }

  handleKata(ctx);
  return 'kata';
};
