import { PageShell } from '../components/PageShell'

type PortalSectionPageProps = {
  title: string
  description: string
}

export function PortalSectionPage({ title, description }: PortalSectionPageProps) {
  return (
    <PageShell title={title} description={description}>
      <div className="placeholder">
        임시 화면입니다. 표시 데이터는 홍길동 / 1234 기준으로 추후 API 연동 예정입니다.
      </div>
    </PageShell>
  )
}
