import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { AddStudentModal } from '../components/AddStudentModal'
import { apiFetch } from '../utils/api'
import type { HomeroomAssignment } from '../types/profile'

type TeacherClassStudentsPageProps = {
  title: string
  description: string
  /** 성적 탭에서만 행 클릭 시 성적 상세로 이동 */
  variant?: 'grades' | 'records'
}

type ApiStudent = {
  _id: string
  name: string
  email: string
  phone: string
  grade: number
  classRoom: number
  number: string
  birthDate: string
}

function formatBirth(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function TeacherClassStudentsPage({
  title,
  description,
  variant = 'records',
}: TeacherClassStudentsPageProps) {
  const navigate = useNavigate()
  const [students, setStudents] = useState<ApiStudent[]>([])
  const [assignments, setAssignments] = useState<HomeroomAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiFetch('/api/teacher/my-class-students')
      const data = (await res.json()) as {
        students?: ApiStudent[]
        homeroomAssignments?: HomeroomAssignment[]
        error?: string
      }
      if (!res.ok) {
        setError(data.error ?? '목록을 불러오지 못했습니다.')
        return
      }
      setStudents(data.students ?? [])
      setAssignments(data.homeroomAssignments ?? [])
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const canAdd = assignments.length > 0
  const showAddButton = variant !== 'grades'

  return (
    <PageShell title={title} description={description}>
      {showAddButton ? (
        <div className="teacher-toolbar">
          <button
            type="button"
            className="add-student-btn"
            disabled={!canAdd}
            onClick={() => setModalOpen(true)}
          >
            + 학생 추가
          </button>
          {!canAdd ? (
            <span className="toolbar-note">담임 학급이 등록되어 있어야 학생을 추가할 수 있습니다.</span>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <p className="profile-status">불러오는 중…</p>
      ) : error ? (
        <p className="form-error" style={{ marginTop: 12 }}>
          {error}
        </p>
      ) : students.length === 0 ? (
        <div className="placeholder">
          등록된 학생이 없습니다. 상단의 <strong>+ 학생 추가</strong>로 계정을 만든 뒤, 학생은 같은
          이메일과 생년월일 6자리(YYMMDD) 비밀번호로 로그인할 수 있습니다.
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>학년</th>
                <th>반</th>
                <th>번호</th>
                <th>이름</th>
                <th>이메일</th>
                <th>연락처</th>
                <th>생년월일</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s._id}
                  className={variant !== 'records' && variant !== 'grades' ? undefined : 'clickable-row'}
                  onClick={
                    variant === 'grades'
                      ? () => navigate(`/teacher/grades/${s._id}`)
                      : variant === 'records'
                        ? () => navigate(`/teacher/records/${s._id}`)
                        : undefined
                  }
                >
                  <td>{s.grade}</td>
                  <td>{s.classRoom}</td>
                  <td>{s.number}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{formatBirth(s.birthDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddButton ? (
        <AddStudentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreated={() => void load()}
          assignments={assignments}
        />
      ) : null}
    </PageShell>
  )
}
