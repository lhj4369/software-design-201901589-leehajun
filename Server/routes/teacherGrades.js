const express = require("express");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const GradeRecord = require("../models/GradeRecord");
const { requireAuth, requireRole } = require("../middleware/requireAuth");
const { normalizeAndValidateScores } = require("../utils/gradeScores");

const router = express.Router();

router.use(requireAuth, requireRole("teacher"));

async function assertHomeroomTeacher(teacherId, studentDoc) {
  const teacher = await Teacher.findById(teacherId).lean();
  if (!teacher) {
    return { error: "교사 정보를 찾을 수 없습니다.", status: 404 };
  }
  const pairs = (teacher.homeroomAssignments || []).map((a) => ({
    grade: a.grade,
    classRoom: a.classRoom,
  }));
  const allowed = pairs.some(
    (p) => p.grade === studentDoc.grade && p.classRoom === studentDoc.classRoom
  );
  if (!allowed) {
    return { error: "담당 학급의 학생이 아닙니다.", status: 403 };
  }
  return {};
}

/**
 * GET /api/teacher/students/:studentId/grades?grade=1&semester=1
 */
router.get("/students/:studentId/grades", async (req, res) => {
  const g = Number(req.query.grade);
  const sem = Number(req.query.semester);
  if (![1, 2, 3].includes(g) || ![1, 2].includes(sem)) {
    return res
      .status(400)
      .json({ error: "쿼리 grade(1~3), semester(1~2)가 필요합니다." });
  }

  const student = await Student.findById(req.params.studentId).lean();
  if (!student) {
    return res.status(404).json({ error: "학생을 찾을 수 없습니다." });
  }

  const check = await assertHomeroomTeacher(req.auth.userId, student);
  if (check.error) {
    return res.status(check.status).json({ error: check.error });
  }

  const record = await GradeRecord.findOne({
    studentId: student._id,
    grade: g,
    semester: sem,
  }).lean();

  return res.json({
    student: {
      _id: student._id,
      name: student.name,
      grade: student.grade,
      classRoom: student.classRoom,
      number: student.number,
    },
    record,
  });
});

/**
 * PUT /api/teacher/students/:studentId/grades
 * body: { grade, semester, scores: { korean: { midterm, final, performance }, ... } }
 */
router.put("/students/:studentId/grades", async (req, res) => {
  const g = Number(req.body.grade);
  const sem = Number(req.body.semester);
  if (![1, 2, 3].includes(g) || ![1, 2].includes(sem)) {
    return res.status(400).json({ error: "grade(1~3), semester(1~2)가 필요합니다." });
  }

  const student = await Student.findById(req.params.studentId).lean();
  if (!student) {
    return res.status(404).json({ error: "학생을 찾을 수 없습니다." });
  }

  const check = await assertHomeroomTeacher(req.auth.userId, student);
  if (check.error) {
    return res.status(check.status).json({ error: check.error });
  }

  const normalized = normalizeAndValidateScores(req.body.scores);
  if (normalized.error) {
    return res.status(400).json({ error: normalized.error });
  }

  const record = await GradeRecord.findOneAndUpdate(
    { studentId: student._id, grade: g, semester: sem },
    { $set: { scores: normalized.scores } },
    { new: true, upsert: true }
  ).lean();

  return res.json({ record });
});

module.exports = router;
