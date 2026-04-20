import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveAuthSession } from '../utils/auth'
import type { AuthUserProfile } from '../types/profile'

export function LoginPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState<'teacher' | 'student' | 'parent'>('student')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setErrorMessage('')

    if (!userId.trim() || !password.trim()) {
      setErrorMessage('아이디(이메일)와 비밀번호를 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userId.trim().toLowerCase(),
          password: password.trim(),
          role,
        }),
      })

      const payload = (await response.json()) as {
        token?: string
        role?: 'teacher' | 'student' | 'parent'
        profile?: AuthUserProfile
        error?: string
      }

      if (!response.ok || !payload.token || !payload.profile || !payload.role) {
        setErrorMessage(payload.error ?? '로그인에 실패했습니다.')
        return
      }

      saveAuthSession(payload.token, payload.profile)
      navigate(`/${payload.role}/home`, { replace: true })
    } catch {
      setErrorMessage('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <h2>00고등학교</h2>
      <p>역할 선택 후 로그인 버튼을 누르면 해당 페이지로 이동합니다.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="role-button-group" role="radiogroup" aria-label="로그인 유형">
          <button
            type="button"
            className={role === 'student' ? 'role-button active' : 'role-button'}
            onClick={() => setRole('student')}
            aria-pressed={role === 'student'}
          >
            학생
          </button>
          <button
            type="button"
            className={role === 'parent' ? 'role-button active' : 'role-button'}
            onClick={() => setRole('parent')}
            aria-pressed={role === 'parent'}
          >
            학부모
          </button>
          <button
            type="button"
            className={role === 'teacher' ? 'role-button active' : 'role-button'}
            onClick={() => setRole('teacher')}
            aria-pressed={role === 'teacher'}
          >
            교사
          </button>
        </div>

        <label htmlFor="userId">아이디</label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="아이디 입력"
        />

        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={
            role === 'student' ? '생년월일 6자리 (YYMMDD)' : '비밀번호 입력'
          }
        />
        {role === 'student' ? (
          <p className="login-role-hint">학생 계정은 생년월일 6자리(예: 070315)로 로그인합니다.</p>
        ) : null}

        <button className="login-button" type="submit">
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>

        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

        <div className="find-actions">
          <button type="button" className="find-button">
            아이디 찾기
          </button>
          <button type="button" className="find-button">
            비밀번호 찾기
          </button>
        </div>
      </form>
    </section>
  )
}
