const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-change-me";

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "인증이 필요합니다." });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.auth = {
      userId: payload.sub,
      role: payload.role,
      email: payload.email,
    };
    return next();
  } catch {
    return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({ error: "인증이 필요합니다." });
    }
    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({ error: "권한이 없습니다." });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole, JWT_SECRET };
