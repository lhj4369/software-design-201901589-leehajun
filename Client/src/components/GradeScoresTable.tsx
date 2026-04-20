import { formatScoreCell, GRADE_SUBJECTS } from '../constants/grades'
import type { GradeScoresMap } from '../constants/grades'

type GradeScoresTableProps = {
  scores: GradeScoresMap
}

const ROWS: { field: keyof GradeScoresMap['korean']; label: string }[] = [
  { field: 'midterm', label: '중간 (100)' },
  { field: 'final', label: '기말 (100)' },
  { field: 'performance', label: '수행평가 (30)' },
]

/** 과목 = 열, 시험 구분 = 행 */
export function GradeScoresTable({ scores }: GradeScoresTableProps) {
  return (
    <div className="grade-matrix-scroll">
      <table className="data-table grade-matrix-table">
        <thead>
          <tr>
            <th className="grade-matrix-corner">구분</th>
            {GRADE_SUBJECTS.map(({ key, label }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map(({ field, label }) => (
            <tr key={field}>
              <th scope="row" className="grade-matrix-rowhead">
                {label}
              </th>
              {GRADE_SUBJECTS.map(({ key }) => (
                <td key={key}>{formatScoreCell(scores[key]?.[field])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
