import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: '대시보드' },
  { to: '/students', label: '학생부' },
  { to: '/grades', label: '성적' },
  { to: '/feedbacks', label: '피드백' },
  { to: '/counselings', label: '상담' },
  { to: '/search', label: '통합검색' },
  { to: '/notifications', label: '알림' },
  { to: '/reports', label: '보고서' },
]

export function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="logo">교사용 학생 관리</h1>
        <nav className="menu">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'menu-link active' : 'menu-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
