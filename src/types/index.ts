export type Student = {
  username?: string;
  firstName?: string;
  lastName?: string;
  id?: number;
  parentId?: number;
};

export type Teacher = {
  username?: string;
  firstName?: string;
  lastName?: string;
  id?: number;
};

export type FollowUpQueue = {
  [key: string]: NodeJS.Timeout;
};

export type Note = {
  from?: string;
  body?: string;
};

export type NoteRoot = {
  groupName?: string;
  groupId?: number;
  date?: string;
  notes?: Note[];
};

export type ExamProblem = {
  problem: string;
  answers: string[];
  correctAnswer: string;
  answer?: string;
  similar?: any[];
};

export type ExamRoot = {
  // date?: string; Reminder using message send from teacher.
  // Started from web
  duration: number;
  title: string;
  groupId?: number;
  id: string;
  problems: ExamProblem[];
};

export type ExamAnswer = {
  title: string;
  groupId?: number;
  examId: string;
  studentId: number;
  studentName: string;
  correctAnswerCount: number;
  problems: ExamProblem[];
};

export type Group = {
  groupId: number;
  groupName?: string;
  teacher?: Teacher;
  students?: Student[];
};

export type Reminder = {
  groupId: number;
  isNotified: boolean;
  date: string;
  type: string;
};

export type LowSchema = {
  notes: NoteRoot[];
  examProblem: ExamRoot[];
  examAnswer: ExamAnswer[];
  groups: Group[];
  reminder: Reminder[];
};
