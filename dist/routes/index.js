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
var express_1 = __importDefault(require("express"));
var lodash_1 = require("lodash");
var db_1 = __importDefault(require("../db"));
var string_similarity_1 = __importDefault(require("string-similarity"));
var router = express_1.default.Router();
router.get('/api/note/:group', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var group, notes;
    return __generator(this, function (_a) {
        group = req.params.group;
        notes = db_1.default
            .get('notes')
            .filter({ groupId: parseInt(group, 10) })
            .value()
            .reverse();
        res.send(notes);
        return [2 /*return*/];
    });
}); });
router.get('/api/note/:group/:date', function (req, res) {
    var _a = req.params, group = _a.group, date = _a.date;
    var notes = db_1.default
        .get('notes')
        .find({ date: date, groupId: parseInt(group, 10) })
        .value();
    res.send(notes);
});
router.get('/api/teacher-class/:guruId', function (req, res) {
    var guruId = parseInt(req.params.guruId, 10);
    var groups = db_1.default.get('groups').filter(function (group) { var _a; return ((_a = group.teacher) === null || _a === void 0 ? void 0 : _a.id) === guruId; });
    res.send(groups);
});
router.post('/api/exam', function (req, res) {
    var body = req.body;
    var exists = db_1.default.get('examProblem').find({ id: body.id }).value();
    var status = '';
    if (!exists) {
        db_1.default.get('examProblem').push(body).write();
        status = 'created';
    }
    else {
        db_1.default.get('examProblem').find({ id: body.id }).assign(body).write();
        status = 'updated';
    }
    res.send({
        status: status
    });
});
router.delete('/api/exam/:id', function (req, res) {
    var id = req.params.id;
    var del = db_1.default.get('examProblem').remove({ id: id }).write();
    res.send(del);
});
router.get(['/api/member/:groupId/:studentId', '/api/member/:groupId'], function (req, res) {
    var _a;
    var _b = req.params, groupId = _b.groupId, studentId = _b.studentId;
    var group = db_1.default
        .get('groups')
        .find({ groupId: parseInt(groupId, 10) })
        .value();
    if (!group) {
        return res.status(404).send({
            error: 'not found'
        });
    }
    if (!studentId) {
        return res.send({
            group: group
        });
    }
    var exists = (_a = group.students) === null || _a === void 0 ? void 0 : _a.find(function (student) { return student.id === parseInt(studentId, 10); });
    if (!exists)
        return res.status(404).send({ error: 'not found ' });
    return res.send({
        student: exists,
        group: lodash_1.omit(group, 'students')
    });
});
router.get('/api/exam/:groupId', function (req, res) {
    var groupId = req.params.groupId;
    var groups = db_1.default
        .get('examProblem')
        .filter(function (exam) { return exam.groupId === parseInt(groupId, 10); })
        .value();
    return res.send(groups);
});
router.get('/api/exam/detail/:examId', function (req, res) {
    var examId = req.params.examId;
    var exam = db_1.default.get('examProblem').find({ id: examId }).value();
    return res.send(exam);
});
// API get dashboard hasil ujian user by exam id
router.get('/api/exam/result/:examId', function (req, res) {
    var examId = req.params.examId;
    var exams = db_1.default.get('examAnswer').filter({ examId: examId }).value();
    exams.forEach(function (exam) {
        console.log("-- Student Name: " + exam.studentName + " --");
        exam.problems.forEach(function (problem, index) {
            console.log("Test: " + problem.answer);
            // @ts-ignore
            var similars = [];
            // const compares = exams.map((examTarget) => examTarget.problems[index].answer);
            // console.log(`Compare to: ${compares}`);
            // const scores = stringSimilarity.findBestMatch(problem.answer, compares);
            // console.log(scores)
            if (!problem.answers.length) {
                exams.forEach(function (examTarget) {
                    if (examTarget.studentId === exam.studentId)
                        return;
                    var score = string_similarity_1.default.compareTwoStrings(problem.answer, examTarget.problems[index].answer);
                    if (score > 0.5) {
                        similars.push({
                            score: score,
                            student: lodash_1.omit(examTarget, 'problems'),
                            target: examTarget.problems[index].answer
                        });
                    }
                    console.log(score);
                    console.log("Target: " + examTarget.problems[index].answer);
                });
            }
            // @ts-ignore
            problem.similars = similars; // eslint-disable-line
        });
    });
    console.log(exams);
    res.send(exams);
});
exports.default = router;
//# sourceMappingURL=index.js.map