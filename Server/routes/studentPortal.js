const express = require("express");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const GradeRecord = require("../models/GradeRecord");
const StudentRecord = require("../models/StudentRecord");
const { requireAuth, requireRole } = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth, requireRole("student"));

router.get("/grades", async (req, res) => {
  const g = Number(req.query.grade);
  const sem = Number(req.query.semester);
  if (![1, 2, 3].includes(g) || ![1, 2].includes(sem)) {
    return res
      .status(400)
      .json({ error: "쿼리 grade(1~3), semester(1~2)가 필요합니다." });
  }

  const student = await Student.findById(req.auth.userId).lean();
  if (!student) {
    return res.status(404).json({ error: "학생을 찾을 수 없습니다." });
  }

  if (g > student.grade) {
    return res.status(403).json({
      error: "아직 이 학년 성적을 열람할 수 없습니다.",
    });
  }

  const record = await GradeRecord.findOne({
    studentId: student._id,
    grade: g,
    semester: sem,
  }).lean();

  return res.json({
    studentGrade: student.grade,
    record,
  });
});

router.get("/record", async (req, res) => {
  const student = await Student.findById(req.auth.userId).lean();
  if (!student) {
    return res.status(404).json({ error: "학생을 찾을 수 없습니다." });
  }

  const [record, gradeRecords, homeroomTeacher] = await Promise.all([
    StudentRecord.findOne({ studentId: student._id }).lean(),
    GradeRecord.find({ studentId: student._id }).sort({ grade: 1, semester: 1 }).lean(),
    Teacher.findOne({
      homeroomAssignments: {
        $elemMatch: { grade: student.grade, classRoom: student.classRoom },
      },
    })
      .select("name")
      .lean(),
  ]);

  return res.json({
    student: { ...student, homeroomTeacherName: homeroomTeacher?.name || null },
    record,
    gradeRecords,
  });
});

module.exports = router;
