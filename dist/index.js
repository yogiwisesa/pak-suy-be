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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = __importDefault(require("telegraf"));
var ts_dotenv_1 = require("ts-dotenv");
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var source_map_support_1 = __importDefault(require("source-map-support"));
var cors_1 = __importDefault(require("cors"));
var dayjs_1 = __importDefault(require("dayjs"));
var routes_1 = __importDefault(require("./routes"));
var bot_handler_1 = __importDefault(require("./bot-handler"));
var db_1 = __importDefault(require("./db"));
var constants_1 = require("./constants");
source_map_support_1.default.install();
var env = ts_dotenv_1.load({
    TELEGRAF: String,
    KATA_TOKEN: String,
    KATA_NL_ID: String
});
var bot = new telegraf_1.default(env.TELEGRAF);
var isRunning = false;
var app = express_1.default();
app.use(cors_1.default({ origin: '*' }));
app.use(body_parser_1.default.json());
app.use(routes_1.default);
bot_handler_1.default(bot);
app.get('/api/start-exam/:examId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var examId, exam, group, promises;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                examId = req.params.examId;
                exam = db_1.default.get('examProblem').find({ id: examId }).value();
                group = db_1.default.get('groups').find({ groupId: exam.groupId }).value();
                // Broadcast -> Group.student
                if (!group.students) {
                    return [2 /*return*/, res.status(404).send({
                            error: 'student not found'
                        })];
                }
                promises = group.students.map(function (student) {
                    return bot.telegram.sendMessage(student.id || '', "Hai, ujian " + exam.title + " telah dimulai, silahkan gunakan link berikut untuk mengikuti ujian " + constants_1.BASE_URL + "/ujian/" + examId + "/" + group.groupId + "/" + student.id);
                });
                return [4 /*yield*/, Promise.all(promises)];
            case 1:
                _a.sent();
                return [4 /*yield*/, bot.telegram.sendMessage(group.groupId, "Hai, ujian " + exam.title + " telah dimulai, pastikan kamu telah menggunakan chatbot Pak Suy ya.\n\nPak Suy sudah mengirimkan URL ujian via japri.")];
            case 2:
                _a.sent();
                return [2 /*return*/, res.send({
                        status: 'ok'
                    })];
        }
    });
}); });
app.post('/api/submit-exam', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, exists, group, student, countChoice_1, countEssay_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                body = req.body;
                exists = db_1.default
                    .get('examAnswer')
                    // .find({ examId: parseInt(body.examId, 10), studenId: parseInt(body.studentId, 10) })
                    .find({ examId: body.examId, studentId: body.studentId })
                    .value();
                group = db_1.default.get('groups').find({ groupId: body.groupId }).value();
                student = (_a = group.students) === null || _a === void 0 ? void 0 : _a.find(function (stud) { return stud.id === body.studentId; });
                if (!(student === null || student === void 0 ? void 0 : student.parentId)) return [3 /*break*/, 3];
                countChoice_1 = 0;
                countEssay_1 = 0;
                body.problems.forEach(function (problem) {
                    if (problem.answers.length) {
                        countChoice_1 += 1;
                        return;
                    }
                    countEssay_1 += 1;
                });
                return [4 /*yield*/, bot.telegram.sendMessage(student === null || student === void 0 ? void 0 : student.parentId, "Hai!\nAnak anda telah mengikuti ujian " + body.title + " dan menjawab dengan benar " + body.correctAnswerCount + " dari " + countChoice_1 + " soal" + (countEssay_1 ? " dan " + countEssay_1 + " soal essay akan diperiksa guru terlebih dahulu" : ''))];
            case 1:
                _b.sent();
                return [4 /*yield*/, bot.telegram.sendMessage(group.groupId, student.firstName + " telah menyelesaikan ujian " + body.title + "!")];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                if (exists)
                    return [2 /*return*/, res.send({ status: 'already submited!' })];
                db_1.default.get('examAnswer').push(body).write();
                return [2 /*return*/, res.send({ status: 'ok' })];
        }
    });
}); });
if (!isRunning) {
    bot.launch().then(function () { return console.log('Bot Running...'); });
    isRunning = true;
}
var checkReminder = function () {
    var reminders = db_1.default
        .get('reminder')
        .filter(function (item) { return !item.isNotified && dayjs_1.default(item.date, 'YYYY-MM-DD').isAfter(dayjs_1.default()); })
        .value();
    reminders.forEach(function (reminder) { return __awaiter(void 0, void 0, void 0, function () {
        var diff, group, parentMsg_1, groupMsg, studentMsg_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    diff = dayjs_1.default(reminder.date, 'YYYY-MM-DD').diff(dayjs_1.default(), 'h');
                    console.log(diff);
                    if (!(diff <= 24)) return [3 /*break*/, 2];
                    group = db_1.default.get('groups').find({ groupId: reminder.groupId }).value();
                    parentMsg_1 = 'Hai, Orang tua siswa. Saya mau mengingatkan besok anak anda ada ujian, mohon diingatkan untuk belajar 🥇';
                    groupMsg = 'Jangan lupa ya besok kita ada ujian 😄';
                    studentMsg_1 = 'Hai, jangan lupa belajar ya, besok ada ujian 😁';
                    if (reminder.type === 'tugas') {
                        groupMsg = 'Jangan lupa ya besok harus mengumpulkan tugas 🙏';
                        parentMsg_1 =
                            'Hai, Orang tua siswa. Anak anda besok harus mengumpulkan tugas, mohon diingatkan untuk dikerjakan ya 🏆';
                        studentMsg_1 = 'Hai, jangan lupa ya besok ada tugas yang harus dikumpulkan';
                    }
                    return [4 /*yield*/, bot.telegram.sendMessage(group.groupId, groupMsg)];
                case 1:
                    _b.sent();
                    (_a = group.students) === null || _a === void 0 ? void 0 : _a.forEach(function (student) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, bot.telegram.sendMessage(student.id || '', studentMsg_1)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, bot.telegram.sendMessage(student.parentId || '', parentMsg_1)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    console.log(reminders);
};
app.get('/run-cron', function (req, res) {
    checkReminder();
    res.send({
        status: 'cron running'
    });
});
var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Api Running - Port: " + port);
});
//# sourceMappingURL=index.js.map