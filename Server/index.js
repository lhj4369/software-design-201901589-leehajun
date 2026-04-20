const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/school";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  const db =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ ok: true, db });
});

async function main() {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
