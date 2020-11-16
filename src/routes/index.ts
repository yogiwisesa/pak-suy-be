import express from 'express';
import { omit } from 'lodash';
import db from '../db';
import stringSimilarity from 'string-similarity';
import { BASE_URL } from '../constants';

import { ExamAnswer } from '../types';

const router = express.Router();

router.get('/api/note/:group', async (req, res) => {
  const { group } = req.params;
  const notes = db
    .get('notes')
    .filter({ groupId: parseInt(group, 10) })
    .value()
    .reverse();

  res.send(notes);
});

router.get('/api/note/:group/:date', (req, res) => {
  const { group, date } = req.params;
  const notes = db
    .get('notes')
    .find({ date, groupId: parseInt(group, 10) })
    .value();

  res.send(notes);
});

router.get('/api/teacher-class/:guruId', (req, res) => {
  const guruId = parseInt(req.params.guruId, 10);

  const groups = db.get('groups').filter((group) => group.teacher?.id === guruId);

  res.send(groups);
});

router.post('/api/exam', (req, res) => {
  const { body } = req;
  const exists = db.get('examProblem').find({ id: body.id }).value();
  let status = '';
  if (!exists) {
    db.get('examProblem').push(body).write();
    status = 'created';
  } else {
    db.get('examProblem').find({ id: body.id }).assign(body).write();
    status = 'updated';
  }
  res.send({
    status
  });
});

router.delete('/api/exam/:id', (req, res) => {
  const { id } = req.params;

  const del = db.get('examProblem').remove({ id }).write();

  res.send(del);
});

router.get(['/api/member/:groupId/:studentId', '/api/member/:groupId'], (req, res) => {
  const { groupId, studentId } = req.params;

  const group = db
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
      group
    });
  }
  const exists = group.students?.find((student) => student.id === parseInt(studentId, 10));

  if (!exists) return res.status(404).send({ error: 'not found ' });

  return res.send({
    student: exists,
    group: omit(group, 'students')
  });
});

router.get('/api/exam/:groupId', (req, res) => {
  const { groupId } = req.params;
  const groups = db
    .get('examProblem')
    .filter((exam) => exam.groupId === parseInt(groupId, 10))
    .value();

  return res.send(groups);
});

router.get('/api/exam/detail/:examId', (req, res) => {
  const { examId } = req.params;
  const exam = db.get('examProblem').find({ id: examId }).value();

  return res.send(exam);
});

// API get dashboard hasil ujian user by exam id
router.get('/api/exam/result/:examId', (req, res) => {
  const { examId } = req.params;
  const exams = db.get('examAnswer').filter({ examId }).value();

  exams.forEach((exam) => {
    console.log(`-- Student Name: ${exam.studentName} --`);
    exam.problems.forEach((problem, index) => {
      console.log(`Test: ${problem.answer}`);
      let similars = [];
      // const compares = exams.map((examTarget) => examTarget.problems[index].answer);
      // console.log(`Compare to: ${compares}`);
      // const scores = stringSimilarity.findBestMatch(problem.answer, compares);
      // console.log(scores)
      if (!problem.answers.length) {
        exams.forEach((examTarget) => {
          if (examTarget.studentId === exam.studentId) return;

          const score = stringSimilarity.compareTwoStrings(
            problem.answer!,
            examTarget.problems[index].answer!
          );
          if (score > 0.5) {
            similars.push({
              score,
              student: omit(examTarget, 'problems'),
              target: examTarget.problems[index].answer
            });
          }
          console.log(score);
          console.log(`Target: ${examTarget.problems[index].answer}`);
        });
      }

      problem.similars = similars;
    });
  });

  console.log(exams);
  res.send(exams);
});

export default router;
