const mongoose = require("mongoose");
const { SUBJECT_KEYS } = require("../constants/gradeSubjects");

const gradeRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    /** 교과 성적이 해당하는 학년(1~3학년) */
    grade: { type: Number, required: true, min: 1, max: 3 },
    /** 학기(1 또는 2) */
    semester: { type: Number, required: true, min: 1, max: 2 },
    scores: {
      type: mongoose.Schema.Types.Mixed,
      default: () => {
        const o = {};
        for (const k of SUBJECT_KEYS) {
          o[k] = { midterm: null, final: null, performance: null };
        }
        return o;
      },
    },
  },
  { timestamps: true }
);

gradeRecordSchema.index(
  { studentId: 1, grade: 1, semester: 1 },
  { unique: true }
);

module.exports = mongoose.model("GradeRecord", gradeRecordSchema);
