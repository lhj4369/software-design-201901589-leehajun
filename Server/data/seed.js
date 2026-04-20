const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const { hashPasswordFromBirthDate } = require("../utils/passwordFromBirthDate");

const TEACHER_EMAIL = "teacher@naver.com";

async function ensureTeacher() {
  let teacher = await Teacher.findOne({ email: TEACHER_EMAIL });
  if (teacher) return teacher;

  const birthDate = new Date(Date.UTC(1999, 0, 23));
  teacher = await Teacher.create({
    name: "홍길동",
    role: "teacher",
    birthDate,
    passwordHash: hashPasswordFromBirthDate(birthDate),
    subject: "국어",
    homeroomAssignments: [
      { grade: 1, classRoom: 1, isViceHomeroom: false },
    ],
    email: TEACHER_EMAIL,
    phone: "010-1234-1234",
  });
  return teacher;
}

async function seedInitialData() {
  await Teacher.updateMany(
    { role: { $exists: false } },
    { $set: { role: "teacher" } }
  );
  await Student.updateMany(
    { role: { $exists: false } },
    { $set: { role: "student" } }
  );

  await ensureTeacher();
}

module.exports = { seedInitialData };
