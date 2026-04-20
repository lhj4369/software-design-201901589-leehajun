import { PageShell } from '../components/PageShell'

type PortalSectionPageProps = {
  title: string
  description: string
}

export function PortalSectionPage({ title, description }: PortalSectionPageProps) {
  return (
    <PageShell title={title} description={description}>
      <div className="placeholder">이 메뉴는 추후 연동 예정입니다.</div>
    </PageShell>
  )
}
