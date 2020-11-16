import { Telegraf } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import * as commandHandler from './command';
import textHandler from './text';

const botHandler = (bot: Telegraf<TelegrafContext>) => {
  bot.start((ctx) =>
    ctx.reply(`
Hai!
Aku Pak Suy, chatbot yang dapat membantu proses belajar-mengajar di sekolah kamu. Untuk memulai, kamu bisa minta guru kamu invite aku ke grup kelas ya 🙂
`)
  );

  bot.on('group_chat_created', commandHandler.handleGroupChatCreated);

  bot.command('idku', commandHandler.handleIdKu);

  bot.command('ortu', commandHandler.handleOrtu);

  bot.command('guru', commandHandler.handleGuru);

  bot.command('bukucatatan', commandHandler.handleBukuCatatan);

  // {base-url}/ujian/atur/guru-id
  bot.command('aturujian', commandHandler.handleAturUjian);

  bot.on('text', textHandler);

  bot.help((ctx) => {
    ctx.reply('Halo');
  });
};

export default botHandler;
