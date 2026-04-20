const mongoose = require("mongoose");

const homeroomAssignmentSchema = new mongoose.Schema(
  {
    grade: { type: Number, required: true, min: 1 },
    classRoom: { type: Number, required: true, min: 1 },
    isViceHomeroom: { type: Boolean, default: false },
  },
  { _id: false }
);

const teacherSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["teacher"],
      default: "teacher",
      immutable: true,
    },
    name: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    subject: { type: String, required: true, trim: true },
    homeroomAssignments: { type: [homeroomAssignmentSchema], default: [] },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    /** 로그인 비밀번호: 생년월일 6자리(YYMMDD)를 bcrypt로 해시한 값. 평문은 저장하지 않음 */
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
