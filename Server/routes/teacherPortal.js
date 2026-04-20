const express = require("express");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const { requireAuth, requireRole } = require("../middleware/requireAuth");
const {
  hashPasswordFromBirthDate,
} = require("../utils/passwordFromBirthDate");
const { parseIsoDateToUtc } = require("../utils/parseIsoDate");

const router = express.Router();

router.use(requireAuth, requireRole("teacher"));

/**
 * 담임/학급으로 연결된 반의 학생 목록 (성적·학생부 탭 공통)
 * GET /api/teacher/my-class-students
 */
router.get("/my-class-students", async (req, res) => {
  const teacher = await Teacher.findById(req.auth.userId).lean();
  if (!teacher) {
    return res.status(404).json({ error: "교사 정보를 찾을 수 없습니다." });
  }

  const pairs = (teacher.homeroomAssignments || []).map((a) => ({
    grade: a.grade,
    classRoom: a.classRoom,
  }));

  if (pairs.length === 0) {
    return res.json({ students: [], homeroomAssignments: [] });
  }

  const students = await Student.find({ $or: pairs })
    .sort({ grade: 1, classRoom: 1, number: 1 })
    .select("-passwordHash")
    .lean();

  return res.json({
    homeroomAssignments: teacher.homeroomAssignments,
    students,
  });
});

/**
 * 학생 계정 생성 (담임이 담당하는 학년·반에 한함)
 * POST /api/teacher/students
 * body: { name, grade, classRoom, number, email, phone, birthDate: "YYYY-MM-DD" }
 */
/**
 * 담당 반에 속한 학생 1명 조회 (성적 상세 페이지 등)
 * GET /api/teacher/students/:studentId
 */
router.get("/students/:studentId", async (req, res) => {
  const teacher = await Teacher.findById(req.auth.userId).lean();
  if (!teacher) {
    return res.status(404).json({ error: "교사 정보를 찾을 수 없습니다." });
  }

  const pairs = (teacher.homeroomAssignments || []).map((a) => ({
    grade: a.grade,
    classRoom: a.classRoom,
  }));

  const student = await Student.findById(req.params.studentId).lean();
  if (!student) {
    return res.status(404).json({ error: "학생을 찾을 수 없습니다." });
  }

  const allowed = pairs.some(
    (p) => p.grade === student.grade && p.classRoom === student.classRoom
  );
  if (!allowed) {
    return res.status(403).json({ error: "담당 학급의 학생이 아닙니다." });
  }

  delete student.passwordHash;
  return res.json({ student });
});

router.post("/students", async (req, res) => {
  const { name, grade, classRoom, number, email, phone, birthDate } =
    req.body || {};

  if (
    !name ||
    grade == null ||
    classRoom == null ||
    !number ||
    !email ||
    !phone ||
    !birthDate
  ) {
    return res.status(400).json({
      error:
        "name, grade, classRoom, number, email, phone, birthDate(YYYY-MM-DD)가 모두 필요합니다.",
    });
  }

  const teacher = await Teacher.findById(req.auth.userId).lean();
  if (!teacher) {
    return res.status(404).json({ error: "교사 정보를 찾을 수 없습니다." });
  }

  const g = Number(grade);
  const c = Number(classRoom);
  const allowed = (teacher.homeroomAssignments || []).some(
    (a) => a.grade === g && a.classRoom === c
  );
  if (!allowed) {
    return res.status(403).json({
      error: "본인이 담당하는 학년·반이 아닙니다.",
    });
  }

  const birth = parseIsoDateToUtc(String(birthDate));
  if (!birth) {
    return res.status(400).json({
      error: "birthDate는 YYYY-MM-DD 형식이어야 합니다.",
    });
  }

  const numStr = String(number).trim();

  try {
    const passwordHash = hashPasswordFromBirthDate(birth);
    const student = await Student.create({
      name: String(name).trim(),
      birthDate: birth,
      number: numStr,
      grade: g,
      classRoom: c,
      email: String(email).toLowerCase().trim(),
      phone: String(phone).trim(),
      passwordHash,
      role: "student",
    });

    const out = student.toObject();
    delete out.passwordHash;
    return res.status(201).json({ student: out });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "이미 사용 중인 이메일이거나 학급 내 번호가 중복입니다." });
    }
    throw err;
  }
});

module.exports = router;
