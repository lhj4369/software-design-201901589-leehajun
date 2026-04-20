import { emptyScores, GRADE_SUBJECTS } from '../constants/grades'
import type { GradeScoresMap } from '../constants/grades'

/** API에서 받은 scores 객체를 폼/표용 맵으로 병합 */
export function mergeGradeScores(raw: unknown): GradeScoresMap {
  const base = emptyScores()
  if (!raw || typeof raw !== 'object') return base
  const o = raw as Record<string, Record<string, unknown>>
  const toNum = (x: unknown) => {
    if (x === undefined || x === null) return null
    const n = Number(x)
    return Number.isFinite(n) ? n : null
  }
  for (const { key } of GRADE_SUBJECTS) {
    const row = o[key]
    if (!row || typeof row !== 'object') continue
    base[key] = {
      midterm: toNum(row.midterm),
      final: toNum(row.final),
      performance: toNum(row.performance),
    }
  }
  return base
}
