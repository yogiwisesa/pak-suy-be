"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lowdb_1 = __importDefault(require("lowdb"));
var FileSync_1 = __importDefault(require("lowdb/adapters/FileSync"));
var adapter = new FileSync_1.default('db.json');
if (process.env.NODE_ENV === 'test') {
    adapter = new FileSync_1.default('db-test.json');
}
var db = lowdb_1.default(adapter);
var dbDefault = {
    notes: [],
    groups: [],
    examAnswer: [],
    examProblem: [],
    reminder: []
};
db.defaults(dbDefault).write();
exports.default = db;
//# sourceMappingURL=index.js.map