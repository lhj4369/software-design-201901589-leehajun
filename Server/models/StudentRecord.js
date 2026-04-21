const mongoose = require("mongoose");

const kindCountSchema = new mongoose.Schema(
  {
    disease: { type: Number, default: 0, min: 0 },
    unexcused: { type: Number, default: 0, min: 0 },
    other: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    grade: { type: Number, required: true, min: 1, max: 3 },
    classDays: { type: Number, default: 0, min: 0 },
    absent: { type: kindCountSchema, default: () => ({}) },
    tardy: { type: kindCountSchema, default: () => ({}) },
    earlyLeave: { type: kindCountSchema, default: () => ({}) },
    result: { type: kindCountSchema, default: () => ({}) },
    notes: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const awardSchema = new mongoose.Schema(
  {
    category: { type: String, enum: ["internal", "external"], default: "internal" },
    title: { type: String, trim: true, default: "" },
    rank: { type: String, trim: true, default: "" },
    awardedAt: { type: Date, default: null },
    organization: { type: String, trim: true, default: "" },
    participants: { type: Number, default: null, min: 0 },
  },
  { _id: false }
);

const studentRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    specialNotes: { type: String, trim: true, default: "" },
    academic: {
      middleSchoolName: { type: String, trim: true, default: "" },
      middleSchoolGraduationYear: { type: Number, default: null, min: 1900, max: 2200 },
      highSchoolName: { type: String, trim: true, default: "" },
      highSchoolAdmissionYear: { type: Number, default: null, min: 1900, max: 2200 },
      notes: { type: String, trim: true, default: "" },
    },
    attendance: {
      type: [attendanceSchema],
      default: () => [1, 2, 3].map((grade) => ({ grade })),
    },
    awards: { type: [awardSchema], default: [] },
    updatedByTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentRecord", studentRecordSchema);
