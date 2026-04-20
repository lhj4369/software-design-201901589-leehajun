import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="auth-page">
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청한 경로가 존재하지 않습니다.</p>
      <Link to="/login" className="inline-link">
        로그인으로 이동
      </Link>
    </section>
  )
}
