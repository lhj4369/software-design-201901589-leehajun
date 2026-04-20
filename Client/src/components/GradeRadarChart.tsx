import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import {
  GRADE_SUBJECTS,
  SUBJECT_TOTAL_MAX,
  subjectTotal,
} from '../constants/grades'
import type { GradeScoresMap } from '../constants/grades'

type GradeRadarChartProps = {
  scores: GradeScoresMap
}

/**
 * 12시 방향부터 시계 방향: 국어 → 수학 → 영어 → 한국사 → 탐구1 → 탐구2
 * 반지름: 과목 총점 / 230
 */
export function GradeRadarChart({ scores }: GradeRadarChartProps) {
  const data = GRADE_SUBJECTS.map(({ key, label }) => ({
    subject: label,
    total: subjectTotal(scores[key]),
  }))

  return (
    <div className="grade-radar-box">
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="72%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: '#4b5563' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, SUBJECT_TOTAL_MAX]}
            tickCount={6}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
          />
          <Radar
            name="총점"
            dataKey="total"
            stroke="#2563eb"
            fill="#93c5fd"
            fillOpacity={0.45}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
