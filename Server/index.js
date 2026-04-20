const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Teacher = require("./models/Teacher");
const Student = require("./models/Student");
const Parent = require("./models/Parent");
const { seedInitialData } = require("./data/seed");
const authRoutes = require("./routes/auth");
const teacherPortalRoutes = require("./routes/teacherPortal");
const teacherGradesRoutes = require("./routes/teacherGrades");
const studentPortalRoutes = require("./routes/studentPortal");

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/school";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherPortalRoutes);
app.use("/api/teacher", teacherGradesRoutes);
app.use("/api/student", studentPortalRoutes);

app.get("/api/health", (_req, res) => {
  const db =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ ok: true, db });
});

app.get("/api/bootstrap-summary", async (_req, res) => {
  const [teacherCount, studentCount, parentCount] = await Promise.all([
    Teacher.countDocuments(),
    Student.countDocuments(),
    Parent.countDocuments(),
  ]);

  res.json({
    teacherCount,
    studentCount,
    parentCount,
    message:
      "JWT 로그인(/api/auth/login) 및 교사용 학생 목록(/api/teacher/my-class-students)을 사용할 수 있습니다.",
    loginHint: {
      teacher: {
        email: "teacher@naver.com",
        passwordPlain: "990123",
        note: "비밀번호는 생년월일 6자리(YYMMDD), 교사 생년월일은 1999-01-23(UTC)",
      },
    },
  });
});

async function main() {
  await mongoose.connect(MONGODB_URI);
  await seedInitialData();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
