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
exports.handleAturUjian = exports.handleOrtu = exports.handleIdKu = exports.handleGuru = exports.handleBukuCatatan = exports.handleGroupChatCreated = void 0;
var db_1 = __importDefault(require("../db"));
var constants_1 = require("../constants");
exports.handleGroupChatCreated = function (ctx) {
    ctx.reply("Halo, Aku Pak Suy, terimakasih sudah mengajak Aku gabung di grup ya!\n\nAku akan bantu proses belajar-mengajar grup kelas kalian\uD83D\uDE04");
};
exports.handleBukuCatatan = function (ctx) {
    var message = ctx.message;
    var groupId = message === null || message === void 0 ? void 0 : message.chat.id;
    var url = constants_1.BASE_URL + "/catatan/" + groupId;
    ctx.reply("Buku catatan bisa kamu akses melalui: " + url);
};
exports.handleGuru = function (ctx) {
    var _a, _b, _c, _d;
    var message = ctx.message;
    if (!(message === null || message === void 0 ? void 0 : message.chat.id))
        return;
    var findClass = db_1.default.get('groups').find({ groupId: message === null || message === void 0 ? void 0 : message.chat.id }).value();
    var teacher = {
        username: (_a = message === null || message === void 0 ? void 0 : message.from) === null || _a === void 0 ? void 0 : _a.username,
        firstName: (_b = message === null || message === void 0 ? void 0 : message.from) === null || _b === void 0 ? void 0 : _b.first_name,
        lastName: (_c = message === null || message === void 0 ? void 0 : message.from) === null || _c === void 0 ? void 0 : _c.last_name,
        id: (_d = message === null || message === void 0 ? void 0 : message.from) === null || _d === void 0 ? void 0 : _d.id
    };
    var group = {
        groupId: message === null || message === void 0 ? void 0 : message.chat.id,
        groupName: message === null || message === void 0 ? void 0 : message.chat.title,
        teacher: teacher
    };
    if (findClass) {
        db_1.default.get('groups').find({ groupId: message === null || message === void 0 ? void 0 : message.chat.id }).assign(group).write();
        ctx.reply("Guru berhasil diperbaharui!", { reply_to_message_id: message === null || message === void 0 ? void 0 : message.message_id });
    }
    else {
        db_1.default.get('groups').push(group).write();
        ctx.reply("Guru telah diatur!", { reply_to_message_id: message === null || message === void 0 ? void 0 : message.message_id });
    }
};
exports.handleIdKu = function (ctx) {
    var _a, _b, _c;
    ctx.reply("ID kamu: " + ((_b = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.id), { reply_to_message_id: (_c = ctx.message) === null || _c === void 0 ? void 0 : _c.message_id });
};
exports.handleOrtu = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var message, parentId, student, findClass, students, studentIndex, newStudents;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                message = ctx.message;
                parentId = parseInt(((_a = message === null || message === void 0 ? void 0 : message.text) === null || _a === void 0 ? void 0 : _a.replace('/ortu', '')) || '', 10);
                if (!!parentId) return [3 /*break*/, 2];
                return [4 /*yield*/, ctx.reply('Mohon sertakan ID orang tua mu ya 😄', {
                        reply_to_message_id: (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.message_id
                    })];
            case 1:
                _l.sent();
                return [2 /*return*/];
            case 2:
                if (!(message === null || message === void 0 ? void 0 : message.chat.id))
                    return [2 /*return*/];
                student = {
                    username: (_c = message === null || message === void 0 ? void 0 : message.from) === null || _c === void 0 ? void 0 : _c.username,
                    firstName: (_d = message === null || message === void 0 ? void 0 : message.from) === null || _d === void 0 ? void 0 : _d.first_name,
                    lastName: (_e = message === null || message === void 0 ? void 0 : message.from) === null || _e === void 0 ? void 0 : _e.last_name,
                    id: (_f = message === null || message === void 0 ? void 0 : message.from) === null || _f === void 0 ? void 0 : _f.id,
                    parentId: parentId
                };
                findClass = db_1.default.get('groups').find({ groupId: message === null || message === void 0 ? void 0 : message.chat.id }).value();
                if (!findClass) {
                    ctx.reply('Guru dari kelas ini belum diatur, mohon untuk bapak ibu guru mengirimkan pesan "/guru"');
                    ctx.reply('Tolong kirim ulang setelah guru diatur ya 🙏', {
                        reply_to_message_id: (_g = ctx.message) === null || _g === void 0 ? void 0 : _g.message_id
                    });
                }
                else {
                    students = [];
                    if (Array.isArray(findClass.students)) {
                        students = findClass.students;
                    }
                    studentIndex = students.findIndex(function (item) { return item.id === student.id; });
                    newStudents = void 0;
                    if (studentIndex < 0) {
                        newStudents = __spreadArrays(students, [student]);
                        console.log('User created!');
                    }
                    else {
                        students[studentIndex] = student;
                        newStudents = findClass.students;
                        console.log('User udpated!');
                    }
                    db_1.default.get('groups').find({ groupId: message === null || message === void 0 ? void 0 : message.chat.id }).assign({ students: newStudents }).write();
                    ctx.reply('Berhasil dicatat 😄', { reply_to_message_id: (_h = ctx.message) === null || _h === void 0 ? void 0 : _h.message_id });
                    if (!message.text)
                        return [2 /*return*/];
                    ctx.telegram.sendMessage(parseInt((_j = message.text) === null || _j === void 0 ? void 0 : _j.replace('/ortu', '').trim(), 10), "Halo, Anda ditambahkan sebagai orang tua " + ((_k = message.from) === null || _k === void 0 ? void 0 : _k.first_name));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.handleAturUjian = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var message, guruid, url;
    var _a;
    return __generator(this, function (_b) {
        message = ctx.message;
        guruid = (_a = message === null || message === void 0 ? void 0 : message.from) === null || _a === void 0 ? void 0 : _a.id;
        if (!guruid)
            return [2 /*return*/];
        url = constants_1.BASE_URL + "/atur-ujian/" + guruid;
        ctx.reply("Kamu bisa mengatur ujian melalui: " + url);
        return [2 /*return*/];
    });
}); };
//# sourceMappingURL=command.js.map