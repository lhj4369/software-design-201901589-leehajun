import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { clearAuthSession, getAuthProfile } from '../utils/auth'

type PortalRole = 'teacher' | 'student' | 'parent'

type PortalLayoutProps = {
  role: PortalRole
}

type NavItem = {
  to: string
  label: string
}

const navConfig: Record<PortalRole, NavItem[]> = {
  teacher: [
    { to: '/teacher/home', label: '홈' },
    { to: '/teacher/grades', label: '성적관리' },
    { to: '/teacher/records', label: '학생부 관리' },
    { to: '/teacher/feedback', label: '피드백' },
    { to: '/teacher/counseling', label: '상담' },
  ],
  student: [
    { to: '/student/home', label: '홈' },
    { to: '/student/grades', label: '성적' },
    { to: '/student/records', label: '학생부' },
    { to: '/student/feedback', label: '피드백' },
    { to: '/student/counseling', label: '상담' },
  ],
  parent: [
    { to: '/parent/home', label: '홈' },
    { to: '/parent/grades', label: '성적' },
    { to: '/parent/records', label: '학생부' },
    { to: '/parent/feedback', label: '피드백' },
    { to: '/parent/counseling', label: '상담' },
  ],
}

const titleConfig: Record<PortalRole, string> = {
  teacher: '교사 페이지',
  student: '학생 페이지',
  parent: '학부모 페이지',
}

export function PortalLayout({ role }: PortalLayoutProps) {
  const navItems = navConfig[role]
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)
  const profile = getAuthProfile()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="logo">{titleConfig[role]}</h1>
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
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-user">
              {profile?.name ?? '사용자'} ({profile?.email ?? 'unknown'})
            </span>
          </div>
          <div className="topbar-right">
            {role === 'teacher' && (
              <input
                className="search-input"
                placeholder="학생 이름 검색 (예정)"
                aria-label="학생 이름 검색"
              />
            )}
            <div className="notice-wrap">
              <button
                className="notice-button"
                type="button"
                onClick={() => setIsNoticeOpen((prev) => !prev)}
              >
                알림
              </button>
              {isNoticeOpen && (
                <div className="notice-popover" role="status">
                  알림 없음.
                </div>
              )}
            </div>
            <button
              className="notice-button"
              type="button"
              onClick={() => {
                clearAuthSession()
                window.location.href = '/login'
              }}
            >
              로그아웃
            </button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  )
}
