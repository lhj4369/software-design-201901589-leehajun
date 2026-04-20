const { SUBJECT_KEYS, SCORE_LIMITS } = require("../constants/gradeSubjects");

function emptyScores() {
  const scores = {};
  for (const key of SUBJECT_KEYS) {
    scores[key] = { midterm: null, final: null, performance: null };
  }
  return scores;
}

/**
 * body.scores 또는 부분 객체를 병합·검증. 잘못된 값이 있으면 { error: string }
 */
function normalizeAndValidateScores(input) {
  const base = emptyScores();
  if (!input || typeof input !== "object") {
    return { scores: base };
  }
  for (const key of SUBJECT_KEYS) {
    const row = input[key];
    if (row == null) continue;
    if (typeof row !== "object") {
      return { error: `scores.${key} 형식이 올바르지 않습니다.` };
    }
    for (const field of ["midterm", "final", "performance"]) {
      if (!(field in row) || row[field] === undefined) {
        continue;
      }
      if (row[field] === null || row[field] === "") {
        base[key][field] = null;
        continue;
      }
      const v = Number(row[field]);
      if (Number.isNaN(v)) {
        return { error: `${key}.${field}는 숫자여야 합니다.` };
      }
      const { min, max } = SCORE_LIMITS[field];
      if (v < min || v > max) {
        const label =
          field === "performance"
            ? "수행평가"
            : field === "midterm"
              ? "중간"
              : "기말";
        return {
          error: `${label} 점수는 ${min}~${max} 사이여야 합니다.`,
        };
      }
      base[key][field] = v;
    }
  }
  return { scores: base };
}

module.exports = { emptyScores, normalizeAndValidateScores };
