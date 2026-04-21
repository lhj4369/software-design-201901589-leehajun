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
    gender: {
      type: String,
      enum: ["male", "female"],
      default: null,
    },
    residentId: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    fatherName: { type: String, trim: true, default: "" },
    fatherBirthDate: { type: Date, default: null },
    motherName: { type: String, trim: true, default: "" },
    motherBirthDate: { type: Date, default: null },
    number: { type: String, required: true, trim: true },
    grade: { type: Number, required: true, min: 1 },
    classRoom: { type: Number, required: true, min: 1 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

studentSchema.index({ grade: 1, classRoom: 1, number: 1 }, { unique: true });

module.exports = mongoose.model("Student", studentSchema);
