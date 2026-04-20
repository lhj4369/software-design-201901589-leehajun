import { useCallback, useEffect, useState } from 'react'
import { PageShell } from '../components/PageShell'
import { GradeRadarToolbar } from '../components/GradeRadarToolbar'
import { GradeScoresPanel } from '../components/GradeScoresPanel'
import { emptyScores } from '../constants/grades'
import type { GradeScoresMap } from '../constants/grades'
import { apiFetch } from '../utils/api'
import { mergeGradeScores } from '../utils/mergeGradeScores'

type GradeRecordDoc = {
  scores: Record<string, { midterm?: number | null; final?: number | null; performance?: number | null }>
}

export function StudentGradesPage() {
  const [currentGrade, setCurrentGrade] = useState<number | null>(null)
  const [viewGrade, setViewGrade] = useState(1)
  const [viewSemester, setViewSemester] = useState(1)
  const [record, setRecord] = useState<GradeRecordDoc | null>(null)
  const [scores, setScores] = useState<GradeScoresMap>(() => emptyScores())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const maxYear = currentGrade != null ? Math.min(currentGrade, 3) : 1

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiFetch(
        `/api/student/grades?grade=${viewGrade}&semester=${viewSemester}`
      )
      const data = (await res.json()) as {
        studentGrade?: number
        record?: GradeRecordDoc | null
        error?: string
      }
      if (!res.ok) {
        setError(data.error ?? '불러오지 못했습니다.')
        return
      }
      if (data.studentGrade != null) setCurrentGrade(data.studentGrade)
      setRecord(data.record ?? null)
      setScores(mergeGradeScores(data.record?.scores))
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }, [viewGrade, viewSemester])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (currentGrade != null && viewGrade > currentGrade) {
      setViewGrade(currentGrade)
    }
  }, [currentGrade, viewGrade])

  const periodControls = (
    <div className="grade-toolbar-controls">
      <label className="grade-select">
        학년
        <select
          value={viewGrade}
          onChange={(e) => setViewGrade(Number(e.target.value))}
        >
          {Array.from({ length: maxYear }, (_, i) => i + 1).map((g) => (
            <option key={g} value={g}>
              {g}학년
            </option>
          ))}
        </select>
      </label>
      <label className="grade-select">
        학기
        <select
          value={viewSemester}
          onChange={(e) => setViewSemester(Number(e.target.value))}
        >
          <option value={1}>1학기</option>
          <option value={2}>2학기</option>
        </select>
      </label>
    </div>
  )

  return (
    <PageShell
      title="성적"
      description="학년·학기를 선택해 본인 성적을 확인합니다. 재학 학년까지만 열람할 수 있습니다."
    >
      {loading ? (
        <p className="profile-status">불러오는 중…</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : (
        <>
          <GradeRadarToolbar scores={scores} controls={periodControls} />
          {!record ? (
            <div className="placeholder">해당 학기의 성적 정보가 없습니다.</div>
          ) : (
            <GradeScoresPanel scores={scores} editMode={false} />
          )}
        </>
      )}
    </PageShell>
  )
}
