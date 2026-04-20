import { GRADE_SUBJECTS } from '../constants/grades'
import type { GradeScoresMap, SubjectKey } from '../constants/grades'

type GradeScoresFormProps = {
  scores: GradeScoresMap
  onChange: (next: GradeScoresMap) => void
}

function parseInput(raw: string): number | null {
  const t = raw.trim()
  if (t === '') return null
  const n = Number(t)
  return Number.isNaN(n) ? null : n
}

const ROWS: {
  field: keyof GradeScoresMap['korean']
  label: string
  max: number
}[] = [
  { field: 'midterm', label: '중간 (100)', max: 100 },
  { field: 'final', label: '기말 (100)', max: 100 },
  { field: 'performance', label: '수행평가 (30)', max: 30 },
]

/** 과목 = 열, 시험 구분 = 행 */
export function GradeScoresForm({ scores, onChange }: GradeScoresFormProps) {
  function updateField(subject: SubjectKey, field: keyof GradeScoresMap[SubjectKey], raw: string) {
    const v = parseInput(raw)
    onChange({
      ...scores,
      [subject]: {
        ...scores[subject],
        [field]: v,
      },
    })
  }

  function displayValue(v: number | null): string {
    if (v === null || Number.isNaN(v)) return ''
    return String(v)
  }

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
          {ROWS.map(({ field, label, max }) => (
            <tr key={field}>
              <th scope="row" className="grade-matrix-rowhead">
                {label}
              </th>
              {GRADE_SUBJECTS.map(({ key }) => (
                <td key={key}>
                  <input
                    className="grade-input"
                    type="number"
                    min={0}
                    max={max}
                    step={1}
                    value={displayValue(scores[key][field])}
                    onChange={(e) => updateField(key, field, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
