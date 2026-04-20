import { type FormEvent, useEffect, useState } from 'react'
import type { HomeroomAssignment } from '../types/profile'
import { apiFetch } from '../utils/api'

type AddStudentModalProps = {
  open: boolean
  onClose: () => void
  onCreated: () => void
  assignments: HomeroomAssignment[]
}

export function AddStudentModal({
  open,
  onClose,
  onCreated,
  assignments,
}: AddStudentModalProps) {
  const [pairIndex, setPairIndex] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [number, setNumber] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setError('')
      setName('')
      setEmail('')
      setPhone('')
      setBirthDate('')
      setNumber('')
      setPairIndex(0)
    }
  }, [open])

  if (!open) return null

  const current = assignments[pairIndex]

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!current) return
    setError('')
    const trimmed = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      number: number.trim(),
      birthDate: birthDate.trim(),
    }
    if (
      !trimmed.name ||
      !trimmed.email ||
      !trimmed.phone ||
      !trimmed.number ||
      !trimmed.birthDate
    ) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    try {
      setSubmitting(true)
      const res = await apiFetch('/api/teacher/students', {
        method: 'POST',
        body: JSON.stringify({
          name: trimmed.name,
          email: trimmed.email,
          phone: trimmed.phone,
          number: trimmed.number,
          birthDate: trimmed.birthDate,
          grade: current.grade,
          classRoom: current.classRoom,
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? '학생 계정을 만들 수 없습니다.')
        return
      }
      onCreated()
      onClose()
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onClose}
      onKeyDown={(ev) => {
        if (ev.key === 'Escape') onClose()
      }}
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-student-title"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="add-student-title">학생 계정 추가</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          {assignments.length > 1 ? (
            <label className="modal-field">
              <span>학급</span>
              <select
                value={pairIndex}
                onChange={(ev) => setPairIndex(Number(ev.target.value))}
              >
                {assignments.map((a, i) => (
                  <option key={`${a.grade}-${a.classRoom}`} value={i}>
                    {a.grade}학년 {a.classRoom}반
                  </option>
                ))}
              </select>
            </label>
          ) : current ? (
            <p className="modal-static-class">
              소속 학급: <strong>{current.grade}학년 {current.classRoom}반</strong>
            </p>
          ) : null}

          <label className="modal-field">
            <span>이름</span>
            <input
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              autoComplete="name"
              required
            />
          </label>
          <label className="modal-field">
            <span>이메일 (로그인 ID)</span>
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="modal-field">
            <span>연락처</span>
            <input
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              autoComplete="tel"
              required
            />
          </label>
          <label className="modal-field">
            <span>생년월일</span>
            <input
              type="date"
              value={birthDate}
              onChange={(ev) => setBirthDate(ev.target.value)}
              required
            />
          </label>
          <p className="modal-hint">
            비밀번호는 생년월일 6자리(YYMMDD)로 자동 설정됩니다. 학생에게 안내해 주세요.
          </p>
          <label className="modal-field">
            <span>번호 (반 내 번호)</span>
            <input
              value={number}
              onChange={(ev) => setNumber(ev.target.value)}
              inputMode="numeric"
              required
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="modal-actions">
            <button type="button" className="modal-btn secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="modal-btn primary" disabled={submitting || !current}>
              {submitting ? '저장 중…' : '계정 만들기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
