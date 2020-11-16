import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { LowSchema } from '../types';

let adapter = new FileSync<LowSchema>('db.json');
if (process.env.NODE_ENV === 'test') {
  adapter = new FileSync<LowSchema>('db-test.json');
}
const db = low(adapter);

const dbDefault = {
  notes: [],
  groups: [],
  examAnswer: [],
  examProblem: [],
  reminder: []
};

db.defaults(dbDefault).write();

export default db;
