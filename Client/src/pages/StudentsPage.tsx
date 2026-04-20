import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'

export function StudentsPage() {
  return (
    <PageShell
      title="학생부 관리"
      description="학생 기본 정보, 출결, 특기사항을 조회/수정하는 화면"
    >
      <div className="placeholder">
        학생 목록 테이블 자리 (예: 홍길동, 2학년 3반)
        <br />
        <Link className="inline-link" to="/students/1">
          임시 상세 페이지 이동
        </Link>
      </div>
    </PageShell>
  )
}
