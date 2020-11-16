"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commandHandler = __importStar(require("./command"));
var text_1 = __importDefault(require("./text"));
var botHandler = function (bot) {
    bot.start(function (ctx) {
        return ctx.reply("\nHai!\nAku Pak Suy, chatbot yang dapat membantu proses belajar-mengajar di sekolah kamu. Untuk memulai, kamu bisa minta guru kamu invite aku ke grup kelas ya \uD83D\uDE42\n");
    });
    bot.on('group_chat_created', commandHandler.handleGroupChatCreated);
    bot.command('idku', commandHandler.handleIdKu);
    bot.command('ortu', commandHandler.handleOrtu);
    bot.command('guru', commandHandler.handleGuru);
    bot.command('bukucatatan', commandHandler.handleBukuCatatan);
    // {base-url}/ujian/atur/guru-id
    bot.command('aturujian', commandHandler.handleAturUjian);
    bot.on('text', text_1.default);
    bot.help(function (ctx) {
        ctx.reply('Halo');
    });
};
exports.default = botHandler;
//# sourceMappingURL=index.js.map