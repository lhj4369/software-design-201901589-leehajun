import type { ReactNode } from 'react'

type PageShellProps = {
  title: string
  description: string
  children?: ReactNode
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="page">
      <header className="page-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      {children ? (
        children
      ) : (
        <div className="placeholder">여기에 화면 컴포넌트를 구현하면 됩니다.</div>
      )}
    </section>
  )
}
