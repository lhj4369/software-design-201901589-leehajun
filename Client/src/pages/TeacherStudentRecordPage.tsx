import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StudentRecordSections } from '../components/StudentRecordSections'
import { GradeScoresTable } from '../components/GradeScoresTable'
import { mergeGradeScores } from '../utils/mergeGradeScores'
import { mergeRecordForm } from '../utils/studentRecordForm'
import type { StudentRecordForm } from '../types/studentRecord'
import { emptyRecordForm } from '../types/studentRecord'
import { apiFetch } from '../utils/api'
import photo from '../assets/image.png'

type StudentDetail = {
  _id: string
  name: string
  gender?: 'male' | 'female' | null
  residentId?: string
  address?: string
  fatherName?: string
  fatherBirthDate?: string | null
  motherName?: string
  motherBirthDate?: string | null
  grade: number
  classRoom: number
  number: string
  birthDate?: string | null
  homeroomTeacherName?: string
}

type GradeDoc = {
  _id: string
  grade: number
  semester: number
  scores: unknown
}

function f(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}


function buildTopRows(currentGrade: number, classRoom: number, number: string, teacherName?: string | null) {
  return [1, 2, 3].map((g) => {
    const visible = g <= currentGrade
    return {
      grade: g,
      classRoom: visible ? String(classRoom) : '-',
      number: visible ? String(number) : '-',
      teacherName: visible ? (teacherName || '-') : '-',
    }
  })
}

export function TeacherStudentRecordPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [recordForm, setRecordForm] = useState<StudentRecordForm>(emptyRecordForm())
  const [gradeRecords, setGradeRecords] = useState<GradeDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!studentId) return
    try {
      setLoading(true)
      setError('')
      const res = await apiFetch(`/api/teacher/students/${studentId}/record`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '학생부를 불러오지 못했습니다.')
        return
      }
      setStudent(data.student)
      setRecordForm(mergeRecordForm(data.record))
      setGradeRecords(Array.isArray(data.gradeRecords) ? data.gradeRecords : [])
      setEditing(false)
    } catch {
      setError('서버 연결에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    void load()
  }, [load])

  function handleCancelEdit() {
    void load()
  }

  async function handleSave() {
    if (!studentId || !student) return
    const payload = {
      personal: {
        name: student.name,
        birthDate: f(student.birthDate),
        gender: student.gender,
        residentId: student.residentId || '',
        address: student.address || '',
        fatherName: student.fatherName || '',
        fatherBirthDate: f(student.fatherBirthDate),
        motherName: student.motherName || '',
        motherBirthDate: f(student.motherBirthDate),
      },
      specialNotes: recordForm.specialNotes,
      academic: {
        middleSchoolName: recordForm.academic.middleSchoolName,
        middleSchoolGraduationYear: recordForm.academic.middleSchoolGraduationYear,
        highSchoolName: recordForm.academic.highSchoolName,
        highSchoolAdmissionYear: recordForm.academic.highSchoolAdmissionYear,
        notes: recordForm.academic.notes,
      },
      attendance: recordForm.attendance,
      awards: recordForm.awards,
    }

    const res = await apiFetch(`/api/teacher/students/${studentId}/record`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || '저장에 실패했습니다.')
      return
    }
    await load()
  }

  return (
    <section className="page record-page">
      <div className="record-top-actions-row">
        <div className="record-head-actions">
          {student && !editing ? (
            <button type="button" className="notice-button" onClick={() => setEditing(true)}>
              수정
            </button>
          ) : null}
          <Link className="notice-button record-back-btn" to="/teacher/records">학생부 목록</Link>
        </div>
      </div>
      <header className="record-page-head">
        <h2>학교생활기록부</h2>
      </header>
      {loading ? <p className="profile-status">불러오는 중…</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {student ? (
        <>
          <div className="record-top-layout">
            <div className="record-top-left">
              <div className="record-school-name">&lt;고등학교&gt;</div>
              <table className="data-table record-top-table">
                <thead>
                  <tr><th>학년</th><th>반</th><th>번호</th><th>담임 성명</th></tr>
                </thead>
                <tbody>
                  {buildTopRows(student.grade, student.classRoom, student.number, student.homeroomTeacherName).map((r) => (
                    <tr key={r.grade}>
                      <td>{r.grade}</td>
                      <td>{r.classRoom}</td>
                      <td>{r.number}</td>
                      <td>{r.teacherName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="profile-photo-frame"><img src={photo} alt="증명사진" className="profile-photo-img" /></div>
          </div>

          <div className="grade-actions">
            {editing ? <button type="button" className="modal-btn secondary" onClick={handleCancelEdit}>취소</button> : null}
            {editing ? <button type="button" className="modal-btn primary" onClick={() => void handleSave()}>저장</button> : null}
          </div>

          <StudentRecordSections
            value={recordForm}
            personal={{
              name: student.name || '',
              birthDate: f(student.birthDate),
              gender: student.gender,
              residentId: student.residentId || '',
              address: student.address || '',
              fatherName: student.fatherName || '',
              fatherBirthDate: f(student.fatherBirthDate),
              motherName: student.motherName || '',
              motherBirthDate: f(student.motherBirthDate),
            }}
            onPersonalChange={(next) => setStudent({ ...student, ...next })}
            onChange={setRecordForm}
            readonly={!editing}
          />

          <section className="record-card record-grade-card">
            <h3>성적</h3>
            {gradeRecords.length === 0 ? (
              <div className="placeholder">성적 기록이 없습니다.</div>
            ) : (
              gradeRecords.map((g) => (
                <div key={g._id} style={{ marginBottom: 16 }}>
                  <p><strong>{g.grade}학년 {g.semester}학기</strong></p>
                  <GradeScoresTable scores={mergeGradeScores(g.scores)} />
                </div>
              ))
            )}
          </section>
        </>
      ) : null}
    </section>
  )
}
