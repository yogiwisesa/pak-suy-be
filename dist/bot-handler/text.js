"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleKata = exports.handleCatat = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
var qs_1 = __importDefault(require("qs"));
var extract_tanggal_1 = __importDefault(require("extract-tanggal"));
var api_1 = require("../api");
var db_1 = __importDefault(require("../db"));
var followUpQueue = {};
exports.handleCatat = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var message, chat, note, groupId, date, findByDate, noteRoot, newNotes;
    var _a, _b;
    return __generator(this, function (_c) {
        message = ctx.message;
        if (!message)
            return [2 /*return*/];
        chat = message.chat;
        note = {
            from: (_a = message.from) === null || _a === void 0 ? void 0 : _a.first_name,
            body: (_b = message.text) === null || _b === void 0 ? void 0 : _b.replace('#catat', '').trim()
        };
        groupId = chat.id;
        date = dayjs_1.default().format('YYYY-MM-DD');
        findByDate = db_1.default.get('notes').find({ date: date, groupId: groupId }).value();
        if (!findByDate) {
            noteRoot = {
                groupName: chat.title,
                groupId: chat.id,
                date: date,
                notes: [note]
            };
            db_1.default.get('notes').push(noteRoot).write();
        }
        else {
            if (!findByDate.notes)
                return [2 /*return*/];
            newNotes = __spreadArrays(findByDate.notes, [note]);
            db_1.default.get('notes').find({ date: date }).assign({ notes: newNotes }).write();
        }
        ctx.reply('Sudah aku catat ya 🙂', { reply_to_message_id: message.message_id });
        return [2 /*return*/];
    });
}); };
exports.handleKata = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var message, messageId, text, data, key, msg_1, query, foundUrl, time, isTugas, isUjian, date;
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                message = ctx.message;
                if (!message)
                    return [2 /*return*/];
                messageId = message.message_id, text = message.text;
                if (!text)
                    return [2 /*return*/];
                console.log("Handle kata for message id: " + messageId);
                return [4 /*yield*/, api_1.KataPredict(text)];
            case 1:
                data = (_h.sent()).data;
                console.log(JSON.stringify(data));
                if (((_a = data.result) === null || _a === void 0 ? void 0 : _a.question.length) && ((_b = data.result) === null || _b === void 0 ? void 0 : _b.question[0].label) === 'question') {
                    key = messageId.toString();
                    msg_1 = 'Hai, pertanyaan ini belum terjawab. Tolong bantu dijawab yaa 😄';
                    followUpQueue[key] = setTimeout(function () {
                        ctx.reply(msg_1, { reply_to_message_id: messageId });
                    }, 6000);
                }
                if (((_c = data.result) === null || _c === void 0 ? void 0 : _c.search_wiki.length) && ((_d = data.result) === null || _d === void 0 ? void 0 : _d.search_wiki[0].value) !== '?') {
                    query = {
                        q: (_e = data.result) === null || _e === void 0 ? void 0 : _e.search_wiki[0].value
                    };
                    foundUrl = "https://www.google.com/search?" + qs_1.default.stringify(query);
                    ctx.reply("Hmm, sepertinya aku menemukan sesuatu di google: " + foundUrl, {
                        reply_to_message_id: messageId
                    });
                }
                time = (_f = data.result) === null || _f === void 0 ? void 0 : _f.kata.find(function (item) { return item.label === 'DATETIME'; });
                isTugas = text.toLowerCase().includes('tugas') ||
                    text.includes('PR') ||
                    text.toLowerCase().includes('pekerjaan rumah') ||
                    text.toLowerCase().includes('assignment');
                isUjian = text.toLowerCase().includes('ujian') ||
                    text.toLowerCase().includes('kuis') ||
                    text.toLowerCase().includes('pemantapan') ||
                    text.includes('UAS');
                if (((_g = data.result) === null || _g === void 0 ? void 0 : _g.kata.length) && time && (isTugas || isUjian)) {
                    date = extract_tanggal_1.default(text);
                    if (dayjs_1.default(date.DateExtracted).isAfter(dayjs_1.default())) {
                        console.log('Create reminder');
                        ctx.reply("Pengingat sudah dijadwalkan! akan aku ingatkan di H-1 ya \uD83D\uDC4D", {
                            reply_to_message_id: messageId
                        });
                        db_1.default.get('reminder')
                            .push({
                            groupId: message.chat.id,
                            date: date.DateExtracted,
                            isNotified: false,
                            type: isTugas ? 'tugas' : 'ujian'
                        })
                            .write();
                    }
                    else {
                        console.log('Date passed.');
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
exports.default = (function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var message, isCatat;
    var _a;
    return __generator(this, function (_b) {
        message = ctx.message;
        if (!(message === null || message === void 0 ? void 0 : message.text)) {
            return [2 /*return*/, null];
        }
        if (message === null || message === void 0 ? void 0 : message.reply_to_message) {
            if (followUpQueue[message.reply_to_message.message_id]) {
                clearTimeout(followUpQueue[message.reply_to_message.message_id]);
                console.log("Queue for " + message.reply_to_message.message_id + " cleared!");
            }
        }
        isCatat = (_a = message === null || message === void 0 ? void 0 : message.text) === null || _a === void 0 ? void 0 : _a.includes('#catat');
        if (isCatat) {
            exports.handleCatat(ctx);
            return [2 /*return*/, 'catat'];
        }
        exports.handleKata(ctx);
        return [2 /*return*/, 'kata'];
    });
}); });
//# sourceMappingURL=text.js.map