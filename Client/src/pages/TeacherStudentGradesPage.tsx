import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { GradeRadarToolbar } from '../components/GradeRadarToolbar'
import { GradeScoresPanel } from '../components/GradeScoresPanel'
import { emptyScores } from '../constants/grades'
import type { GradeScoresMap } from '../constants/grades'
import { apiFetch } from '../utils/api'
import { mergeGradeScores } from '../utils/mergeGradeScores'

type StudentBrief = {
  _id: string
  name: string
  grade: number
  classRoom: number
  number: string
}

type GradeRecordDoc = {
  _id: string
  scores: Record<string, { midterm?: number | null; final?: number | null; performance?: number | null }>
}

export function TeacherStudentGradesPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const [student, setStudent] = useState<StudentBrief | null>(null)
  const [recordGrade, setRecordGrade] = useState(1)
  const [recordSemester, setRecordSemester] = useState(1)
  const [record, setRecord] = useState<GradeRecordDoc | null>(null)
  const [scores, setScores] = useState<GradeScoresMap>(() => emptyScores())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)

  const load = useCallback(async () => {
    if (!studentId) return
    try {
      setLoading(true)
      setError(null)
      const res = await apiFetch(
        `/api/teacher/students/${studentId}/grades?grade=${recordGrade}&semester=${recordSemester}`
      )
      const data = (await res.json()) as {
        student?: StudentBrief
        record?: GradeRecordDoc | null
        error?: string
      }
      if (!res.ok) {
        setError(data.error ?? '불러오지 못했습니다.')
        return
      }
      if (data.student) setStudent(data.student)
      setRecord(data.record ?? null)
      setScores(mergeGradeScores(data.record?.scores))
      setEditing(false)
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }, [studentId, recordGrade, recordSemester])

  useEffect(() => {
    void load()
  }, [load])

  async function handleSave() {
    if (!studentId) return
    try {
      setSaving(true)
      setError(null)
      const res = await apiFetch(`/api/teacher/students/${studentId}/grades`, {
        method: 'PUT',
        body: JSON.stringify({
          grade: recordGrade,
          semester: recordSemester,
          scores,
        }),
      })
      const data = (await res.json()) as { record?: GradeRecordDoc; error?: string }
      if (!res.ok) {
        setError(data.error ?? '저장에 실패했습니다.')
        return
      }
      if (data.record) {
        setRecord(data.record)
        setScores(mergeGradeScores(data.record.scores))
      }
      setEditing(false)
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setSaving(false)
    }
  }

  const hasRecord = Boolean(record)
  const title = student ? `${student.name} 성적` : '학생 성적'

  const periodControls = (
    <div className="grade-toolbar-controls">
      <label className="grade-select">
        학년
        <select
          value={recordGrade}
          onChange={(e) => setRecordGrade(Number(e.target.value))}
          disabled={editing}
        >
          <option value={1}>1학년</option>
          <option value={2}>2학년</option>
          <option value={3}>3학년</option>
        </select>
      </label>
      <label className="grade-select">
        학기
        <select
          value={recordSemester}
          onChange={(e) => setRecordSemester(Number(e.target.value))}
          disabled={editing}
        >
          <option value={1}>1학기</option>
          <option value={2}>2학기</option>
        </select>
      </label>
    </div>
  )

  return (
    <PageShell
      title={title}
      description="학년·학기를 선택해 성적을 열람하거나 수정합니다. 중간·기말은 100점, 수행평가는 30점 만점입니다."
    >
      <div className="teacher-toolbar" style={{ marginBottom: 12 }}>
        <Link className="inline-link" to="/teacher/grades">
          ← 성적 관리 목록
        </Link>
      </div>

      {student ? (
        <p className="student-grade-meta">
          <span>학년 {student.grade}</span>
          <span>반 {student.classRoom}</span>
          <span>번호 {student.number}</span>
        </p>
      ) : null}

      {loading ? (
        <p className="profile-status">불러오는 중…</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : editing ? (
        <>
          <GradeRadarToolbar scores={scores} controls={periodControls} />
          <GradeScoresPanel scores={scores} editMode onChange={setScores} />
          <div className="grade-actions">
            <button
              type="button"
              className="modal-btn secondary"
              onClick={() => {
                setEditing(false)
                setScores(mergeGradeScores(record?.scores))
              }}
            >
              취소
            </button>
            <button
              type="button"
              className="modal-btn primary"
              disabled={saving}
              onClick={() => void handleSave()}
            >
              {saving ? '저장 중…' : '저장'}
            </button>
          </div>
        </>
      ) : hasRecord ? (
        <>
          <GradeRadarToolbar scores={scores} controls={periodControls} />
          <GradeScoresPanel scores={scores} editMode={false} />
          <div className="grade-actions">
            <button type="button" className="modal-btn primary" onClick={() => setEditing(true)}>
              수정
            </button>
          </div>
        </>
      ) : (
        <>
          <GradeRadarToolbar scores={scores} controls={periodControls} />
          <div className="grade-empty-block">
            <div className="placeholder">
              이 학기에 등록된 성적이 없습니다.
              <div className="grade-actions">
                <button type="button" className="modal-btn primary" onClick={() => setEditing(true)}>
                  성적 추가
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </PageShell>
  )
}
