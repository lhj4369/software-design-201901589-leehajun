const express = require("express");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Parent = require("../models/Parent");
const { comparePassword } = require("../utils/passwordFromBirthDate");
const { ROLE_LIST } = require("../constants/roles");
const { requireAuth, JWT_SECRET } = require("../middleware/requireAuth");

const router = express.Router();

const modelByRole = {
  teacher: Teacher,
  student: Student,
  parent: Parent,
};

/**
 * POST /api/auth/login
 * body: { email, password, role: 'teacher' | 'student' | 'parent' }
 */
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password || !role) {
    return res.status(400).json({
      error: "email, password, role이 필요합니다.",
    });
  }
  if (!ROLE_LIST.includes(role)) {
    return res.status(400).json({ error: "유효하지 않은 role입니다." });
  }

  const Model = modelByRole[role];
  const user = await Model.findOne({ email: String(email).toLowerCase() })
    .select("+passwordHash")
    .exec();

  if (!user) {
    return res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });
  }

  const ok = await comparePassword(String(password), user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });
  }

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  const profile = buildProfile(user, role);

  return res.json({
    token,
    role: user.role,
    profile,
  });
});

/**
 * GET /api/auth/me
 */
router.get("/me", requireAuth, async (req, res) => {
  const { role, userId } = req.auth;
  const Model = modelByRole[role];
  if (!Model) {
    return res.status(400).json({ error: "알 수 없는 역할입니다." });
  }
  const user = await Model.findById(userId).lean();
  if (!user) {
    return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
  }
  return res.json({ profile: buildProfile(user, role) });
});

function buildProfile(doc, role) {
  if (role === "teacher") {
    return {
      role: "teacher",
      id: doc._id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      subject: doc.subject,
      birthDate: doc.birthDate,
      homeroomAssignments: doc.homeroomAssignments || [],
    };
  }
  if (role === "student") {
    return {
      role: "student",
      id: doc._id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      grade: doc.grade,
      classRoom: doc.classRoom,
      number: doc.number,
      birthDate: doc.birthDate,
    };
  }
  if (role === "parent") {
    return {
      role: "parent",
      id: doc._id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      birthDate: doc.birthDate,
      childStudentIds: doc.childStudentIds || [],
    };
  }
  return {};
}

module.exports = router;
