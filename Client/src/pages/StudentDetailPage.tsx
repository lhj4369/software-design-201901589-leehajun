import { useParams } from 'react-router-dom'
import { PageShell } from '../components/PageShell'

export function StudentDetailPage() {
  const { studentId } = useParams()

  return (
    <PageShell
      title={`학생 상세 (${studentId})`}
      description="학생별 성적/피드백/상담 히스토리를 모아보는 상세 화면"
    />
  )
}
