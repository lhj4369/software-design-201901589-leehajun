import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { PageShell } from '../components/PageShell'
import { apiFetch } from '../utils/api'
import type { AuthUserProfile, HomeroomAssignment } from '../types/profile'
import profilePhotoPlaceholder from '../assets/image.png'

type PortalRole = 'teacher' | 'student' | 'parent'

type PortalHomePageProps = {
  role: PortalRole
}

const roleText = {
  teacher: {
    title: '교사 홈',
    desc: '담당 학급과 연락처 등 교사 정보를 확인합니다.',
  },
  student: {
    title: '학생 홈',
    desc: '학생 개인 정보 및 소속 학급을 확인합니다.',
  },
  parent: {
    title: '학부모 홈',
    desc: '보호자 계정 정보를 확인합니다.',
  },
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatHomerooms(list?: HomeroomAssignment[]) {
  if (!list?.length) return '—'
  return list
    .map((a) => `${a.grade}학년 ${a.classRoom}반${a.isViceHomeroom ? ' (부담임)' : ''}`)
    .join(', ')
}

function ProfileHomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="profile-home-layout">
      <div className="profile-photo-frame">
        <img
          src={profilePhotoPlaceholder}
          alt="증명사진"
          className="profile-photo-img"
        />
      </div>
      <div className="profile-info-side">
        <div className="info-grid">{children}</div>
      </div>
    </div>
  )
}

export function PortalHomePage({ role }: PortalHomePageProps) {
  const text = roleText[role]
  const [profile, setProfile] = useState<AuthUserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await apiFetch('/api/auth/me')
        const data = (await res.json()) as { profile?: AuthUserProfile; error?: string }
        if (!res.ok) {
          if (!cancelled) setError(data.error ?? '프로필을 불러오지 못했습니다.')
          return
        }
        if (data.profile && !cancelled) setProfile(data.profile)
      } catch {
        if (!cancelled) setError('서버에 연결할 수 없습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [role])

  return (
    <PageShell title={text.title} description={text.desc}>
      {loading ? (
        <p className="profile-status">불러오는 중…</p>
      ) : error ? (
        <p className="form-error" style={{ marginTop: 16 }}>
          {error}
        </p>
      ) : profile && profile.role === 'teacher' ? (
        <ProfileHomeLayout>
          <div className="info-item">
            <span className="info-label">이름</span>
            <strong>{profile.name}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">이메일</span>
            <strong>{profile.email}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">연락처</span>
            <strong>{profile.phone ?? '—'}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">담당 과목</span>
            <strong>{profile.subject ?? '—'}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">생년월일</span>
            <strong>{formatDate(profile.birthDate)}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">담임 학급</span>
            <strong>{formatHomerooms(profile.homeroomAssignments)}</strong>
          </div>
        </ProfileHomeLayout>
      ) : profile && profile.role === 'student' ? (
        <ProfileHomeLayout>
          <div className="info-item">
            <span className="info-label">이름</span>
            <strong>{profile.name}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">이메일</span>
            <strong>{profile.email}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">학년·반·번호</span>
            <strong>
              {profile.grade != null && profile.classRoom != null
                ? `${profile.grade}학년 ${profile.classRoom}반 ${profile.number ?? ''}번`
                : '—'}
            </strong>
          </div>
          <div className="info-item">
            <span className="info-label">연락처</span>
            <strong>{profile.phone ?? '—'}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">생년월일</span>
            <strong>{formatDate(profile.birthDate)}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">주소</span>
            <strong>{profile.address || '—'}</strong>
          </div>
        </ProfileHomeLayout>
      ) : profile && profile.role === 'parent' ? (
        <ProfileHomeLayout>
          <div className="info-item">
            <span className="info-label">이름</span>
            <strong>{profile.name}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">이메일</span>
            <strong>{profile.email}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">연락처</span>
            <strong>{profile.phone ?? '—'}</strong>
          </div>
          <div className="info-item">
            <span className="info-label">생년월일</span>
            <strong>{formatDate(profile.birthDate)}</strong>
          </div>
        </ProfileHomeLayout>
      ) : (
        <p className="profile-status">표시할 정보가 없습니다.</p>
      )}
    </PageShell>
  )
}
