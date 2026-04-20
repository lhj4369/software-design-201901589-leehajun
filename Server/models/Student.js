const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["student"],
      default: "student",
      immutable: true,
    },
    name: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    number: { type: String, required: true, trim: true },
    grade: { type: Number, required: true, min: 1 },
    classRoom: { type: Number, required: true, min: 1 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    /** 로그인 비밀번호: 생년월일 6자리(YYMMDD)를 bcrypt로 해시한 값. 평문은 저장하지 않음 */
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

studentSchema.index({ grade: 1, classRoom: 1, number: 1 }, { unique: true });

module.exports = mongoose.model("Student", studentSchema);
