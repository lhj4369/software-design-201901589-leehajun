import type { ReactNode } from 'react'
import { GradeRadarChart } from './GradeRadarChart'
import { SUBJECT_TOTAL_MAX } from '../constants/grades'
import type { GradeScoresMap } from '../constants/grades'

type GradeRadarToolbarProps = {
  scores: GradeScoresMap
  /** 우측: 학년·학기 등 컨트롤 */
  controls: ReactNode
}

export function GradeRadarToolbar({ scores, controls }: GradeRadarToolbarProps) {
  return (
    <div className="grade-radar-toolbar">
      <div className="grade-radar-toolbar-left">
        <p className="grade-chart-caption">
          과목별 총점 레이더 (만점 {SUBJECT_TOTAL_MAX}점 기준)
        </p>
        <GradeRadarChart scores={scores} />
      </div>
      <div className="grade-radar-toolbar-right">{controls}</div>
    </div>
  )
}
