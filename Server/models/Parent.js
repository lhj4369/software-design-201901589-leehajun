const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["parent"],
      default: "parent",
      immutable: true,
    },
    name: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, required: true, trim: true },
    /** 연결된 자녀 학생 ObjectId (추후 확장) */
    childStudentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parent", parentSchema);
