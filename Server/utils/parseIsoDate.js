/**
 * "YYYY-MM-DD" → UTC 자정 Date (저장·비밀번호 YYMMDD와 일치시키기 위함)
 */
function parseIsoDateToUtc(isoDateString) {
  if (typeof isoDateString !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDateString.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return new Date(Date.UTC(y, mo - 1, d));
}

module.exports = { parseIsoDateToUtc };
