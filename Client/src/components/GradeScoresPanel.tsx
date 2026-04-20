import { GradeScoresForm } from './GradeScoresForm'
import { GradeScoresTable } from './GradeScoresTable'
import type { GradeScoresMap } from '../constants/grades'

type GradeScoresPanelProps = {
  scores: GradeScoresMap
  editMode: boolean
  onChange?: (next: GradeScoresMap) => void
}

/** 성적 표(또는 입력 폼)만 — 레이더·학년학기는 GradeRadarToolbar에서 배치 */
export function GradeScoresPanel({ scores, editMode, onChange }: GradeScoresPanelProps) {
  return (
    <div className="grade-table-only-wrap">
      {editMode && onChange ? (
        <GradeScoresForm scores={scores} onChange={onChange} />
      ) : (
        <GradeScoresTable scores={scores} />
      )}
    </div>
  )
}
