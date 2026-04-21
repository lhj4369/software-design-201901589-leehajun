import { useEffect, useState } from 'react'
import { PageShell } from '../components/PageShell'
import { StudentRecordSections } from '../components/StudentRecordSections'
import { GradeScoresTable } from '../components/GradeScoresTable'
import { mergeRecordForm } from '../utils/studentRecordForm'
import { mergeGradeScores } from '../utils/mergeGradeScores'
import type { StudentRecordForm } from '../types/studentRecord'
import { emptyRecordForm } from '../types/studentRecord'
import { apiFetch } from '../utils/api'
import photo from '../assets/image.png'

type GradeDoc = { _id: string; grade: number; semester: number; scores: unknown }

type StudentDetail = {
  name: string
  grade?: number
  classRoom?: number
  number?: string
  homeroomTeacherName?: string
  birthDate?: string | null
  gender?: 'male' | 'female' | null
  residentId?: string
  address?: string
  fatherName?: string
  fatherBirthDate?: string | null
  motherName?: string
  motherBirthDate?: string | null
}

function f(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
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

export function StudentRecordPage() {
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [recordForm, setRecordForm] = useState<StudentRecordForm>(emptyRecordForm())
  const [gradeRecords, setGradeRecords] = useState<GradeDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const res = await apiFetch('/api/student/record')
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || '학생부를 불러오지 못했습니다.')
          return
        }
        setStudent(data.student)
        setRecordForm(mergeRecordForm(data.record))
        setGradeRecords(Array.isArray(data.gradeRecords) ? data.gradeRecords : [])
      } catch {
        setError('서버 연결에 실패했습니다.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <PageShell title="학생부" description="학생부는 열람 전용입니다.">
      {loading ? <p className="profile-status">불러오는 중…</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {student ? (
        <>
          <div className="record-top-layout">
            <div className="record-top-left">
              <table className="data-table record-top-table">
                <thead>
                  <tr><th>학년</th><th>반</th><th>번호</th><th>담임 성명</th></tr>
                </thead>
                <tbody>
                  {buildTopRows(student.grade ?? 1, student.classRoom ?? 1, student.number ?? '-', student.homeroomTeacherName).map((r) => (
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
            readonly
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
    </PageShell>
  )
}
