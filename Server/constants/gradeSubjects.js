/** 성적 과목 키(영문) — DB·API에서 사용, 라벨은 프론트에서 매핑 */
const SUBJECT_KEYS = [
  "korean",
  "math",
  "english",
  "koreanHistory",
  "inquiry1",
  "inquiry2",
];

const SCORE_LIMITS = {
  midterm: { min: 0, max: 100 },
  final: { min: 0, max: 100 },
  performance: { min: 0, max: 30 },
};

module.exports = { SUBJECT_KEYS, SCORE_LIMITS };
