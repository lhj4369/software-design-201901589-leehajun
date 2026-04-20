const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

/**
 * 생년월일(Date) → 초기 비밀번호용 6자리 문자열 (예: 1999-07-08 → "990708")
 * 저장은 UTC 기준 날짜 부분을 사용해 타임존으로 날짜가 하루 밀리는 경우를 줄입니다.
 */
function birthDateToYymmdd(birthDate) {
  const d = birthDate instanceof Date ? birthDate : new Date(birthDate);
  const yy = String(d.getUTCFullYear() % 100).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

function hashPasswordFromBirthDate(birthDate) {
  const plain = birthDateToYymmdd(birthDate);
  return bcrypt.hashSync(plain, SALT_ROUNDS);
}

async function comparePassword(plainText, passwordHash) {
  return bcrypt.compare(plainText, passwordHash);
}

module.exports = {
  birthDateToYymmdd,
  hashPasswordFromBirthDate,
  comparePassword,
};
