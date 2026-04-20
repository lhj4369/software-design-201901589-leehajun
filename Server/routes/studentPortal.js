const express = require("express");
const Student = require("../models/Student");
const GradeRecord = require("../models/GradeRecord");
const { requireAuth, requireRole } = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth, requireRole("student"));

/**
 * GET /api/student/grades?grade=1&semester=1
 * 본인 학년 이하(예: 2학년 재학 시 1·2학년) 성적만 조회 가능
 */
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

module.exports = router;
