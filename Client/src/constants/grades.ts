export const GRADE_SUBJECTS = [
  { key: 'korean', label: '국어' },
  { key: 'math', label: '수학' },
  { key: 'english', label: '영어' },
  { key: 'koreanHistory', label: '한국사' },
  { key: 'inquiry1', label: '탐구1' },
  { key: 'inquiry2', label: '탐구2' },
] as const

export type SubjectKey = (typeof GRADE_SUBJECTS)[number]['key']

export type SubjectScores = {
  midterm: number | null
  final: number | null
  performance: number | null
}

export type GradeScoresMap = Record<SubjectKey, SubjectScores>

/** 과목별 총점 상한: 중간 100 + 기말 100 + 수행 30 */
export const SUBJECT_TOTAL_MAX = 230

export function emptyScores(): GradeScoresMap {
  const o = {} as GradeScoresMap
  for (const { key } of GRADE_SUBJECTS) {
    o[key] = { midterm: null, final: null, performance: null }
  }
  return o
}

/** 레이더·합계용: 미입력 칸은 합산에서 0으로 간주 */
export function subjectTotal(s: SubjectScores): number {
  return (s.midterm ?? 0) + (s.final ?? 0) + (s.performance ?? 0)
}

/** 표시용: 미입력은 ×, 0은 0 */
export function formatScoreCell(v: number | null | undefined): string {
  if (v == null || Number.isNaN(v)) return '×'
  return String(v)
}
