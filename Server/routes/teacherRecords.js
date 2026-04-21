const express = require("express");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const GradeRecord = require("../models/GradeRecord");
const StudentRecord = require("../models/StudentRecord");
const { requireAuth, requireRole } = require("../middleware/requireAuth");
const { parseIsoDateToUtc } = require("../utils/parseIsoDate");

const router = express.Router();

router.use(requireAuth, requireRole("teacher"));

async function assertHomeroomTeacher(teacherId, studentDoc) {
  const teacher = await Teacher.findById(teacherId).lean();
  if (!teacher) return { status: 404, error: "교사 정보를 찾을 수 없습니다." };

  const pairs = (teacher.homeroomAssignments || []).map((a) => ({
    grade: a.grade,
    classRoom: a.classRoom,
  }));
  const allowed = pairs.some(
    (p) => p.grade === studentDoc.grade && p.classRoom === studentDoc.classRoom
  );
  if (!allowed) return { status: 403, error: "담당 학급의 학생이 아닙니다." };
  return { teacher };
}

function pickStudentProfile(student) {
  return {
    _id: student._id,
    name: student.name,
    email: student.email,
    phone: student.phone,
    grade: student.grade,
    classRoom: student.classRoom,
    number: student.number,
    birthDate: student.birthDate,
    gender: student.gender || null,
    residentId: student.residentId || "",
    address: student.address || "",
    fatherName: student.fatherName || "",
    fatherBirthDate: student.fatherBirthDate || null,
    motherName: student.motherName || "",
    motherBirthDate: student.motherBirthDate || null,
    homeroomTeacherName: null,
  };
}

router.get("/students/:studentId/record", async (req, res) => {
  const student = await Student.findById(req.params.studentId).lean();
  if (!student) return res.status(404).json({ error: "학생을 찾을 수 없습니다." });

  const check = await assertHomeroomTeacher(req.auth.userId, student);
  if (check.error) return res.status(check.status).json({ error: check.error });
  const teacher = check.teacher;

  const [record, gradeRecords] = await Promise.all([
    StudentRecord.findOne({ studentId: student._id }).lean(),
    GradeRecord.find({ studentId: student._id }).sort({ grade: 1, semester: 1 }).lean(),
  ]);

  return res.json({
    student: { ...pickStudentProfile(student), homeroomTeacherName: teacher?.name || null },
    record,
    gradeRecords,
  });
});

router.put("/students/:studentId/record", async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) return res.status(404).json({ error: "학생을 찾을 수 없습니다." });

  const check = await assertHomeroomTeacher(req.auth.userId, student);
  if (check.error) return res.status(check.status).json({ error: check.error });
  const teacher = check.teacher;

  const body = req.body || {};

  if (body.personal && typeof body.personal === "object") {
    const p = body.personal;
    if (typeof p.name === "string") student.name = p.name.trim();
    if (typeof p.birthDate === "string") {
      const d = parseIsoDateToUtc(p.birthDate);
      if (!d) return res.status(400).json({ error: "birthDate 형식이 올바르지 않습니다." });
      student.birthDate = d;
    }
    if (typeof p.gender === "string" && ["male", "female"].includes(p.gender)) {
      student.gender = p.gender;
    }
    if (typeof p.residentId === "string") student.residentId = p.residentId.trim();
    if (typeof p.address === "string") student.address = p.address.trim();
    if (typeof p.fatherName === "string") student.fatherName = p.fatherName.trim();
    if (typeof p.motherName === "string") student.motherName = p.motherName.trim();

    if (typeof p.fatherBirthDate === "string") {
      const d = parseIsoDateToUtc(p.fatherBirthDate);
      if (!d) return res.status(400).json({ error: "fatherBirthDate 형식이 올바르지 않습니다." });
      student.fatherBirthDate = d;
    }
    if (typeof p.motherBirthDate === "string") {
      const d = parseIsoDateToUtc(p.motherBirthDate);
      if (!d) return res.status(400).json({ error: "motherBirthDate 형식이 올바르지 않습니다." });
      student.motherBirthDate = d;
    }
  }
  await student.save();

  const update = {
    updatedByTeacherId: req.auth.userId,
  };

  if (typeof body.specialNotes === "string") {
    update.specialNotes = body.specialNotes;
  }

  if (body.academic && typeof body.academic === "object") {
    update.academic = {
      middleSchoolName: String(body.academic.middleSchoolName || "").trim(),
      middleSchoolGraduationYear:
        body.academic.middleSchoolGraduationYear == null || body.academic.middleSchoolGraduationYear === ""
          ? null
          : Number(body.academic.middleSchoolGraduationYear),
      highSchoolName: String(body.academic.highSchoolName || "").trim(),
      highSchoolAdmissionYear:
        body.academic.highSchoolAdmissionYear == null || body.academic.highSchoolAdmissionYear === ""
          ? null
          : Number(body.academic.highSchoolAdmissionYear),
      notes: String(body.academic.notes || ""),
    };
  }

  if (Array.isArray(body.attendance)) {
    update.attendance = body.attendance.map((r) => ({
      grade: Number(r.grade || 1),
      classDays: Number(r.classDays || 0),
      absent: {
        disease: Number(r.absent?.disease || 0),
        unexcused: Number(r.absent?.unexcused || 0),
        other: Number(r.absent?.other || 0),
      },
      tardy: {
        disease: Number(r.tardy?.disease || 0),
        unexcused: Number(r.tardy?.unexcused || 0),
        other: Number(r.tardy?.other || 0),
      },
      earlyLeave: {
        disease: Number(r.earlyLeave?.disease || 0),
        unexcused: Number(r.earlyLeave?.unexcused || 0),
        other: Number(r.earlyLeave?.other || 0),
      },
      result: {
        disease: Number(r.result?.disease || 0),
        unexcused: Number(r.result?.unexcused || 0),
        other: Number(r.result?.other || 0),
      },
      notes: String(r.notes || ""),
    }));
  }

  if (Array.isArray(body.awards)) {
    update.awards = body.awards.map((a) => {
      let awardedAt = null;
      if (typeof a.awardedAt === "string" && a.awardedAt.trim()) {
        awardedAt = parseIsoDateToUtc(a.awardedAt);
      }

      let participants = null;
      if (a.participants != null && String(a.participants).trim() !== "") {
        const parsed = Number(a.participants);
        participants = Number.isFinite(parsed) ? parsed : null;
      }

      return {
        category: a.category === "external" ? "external" : "internal",
        title: String(a.title || "").trim(),
        rank: String(a.rank || "").trim(),
        awardedAt,
        organization: String(a.organization || "").trim(),
        participants,
      };
    });
  }

  const record = await StudentRecord.findOneAndUpdate(
    { studentId: student._id },
    { $set: update },
    { upsert: true, new: true }
  ).lean();

  const gradeRecords = await GradeRecord.find({ studentId: student._id })
    .sort({ grade: 1, semester: 1 })
    .lean();

  return res.json({
    student: { ...pickStudentProfile(student), homeroomTeacherName: teacher?.name || null },
    record,
    gradeRecords,
  });
});

module.exports = router;
