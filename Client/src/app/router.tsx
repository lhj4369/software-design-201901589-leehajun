import { Navigate, createBrowserRouter } from 'react-router-dom'
import { GuestOnly, RequireAuth } from '../components/RouteGuards'
import { PortalLayout } from '../layouts/PortalLayout'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PortalHomePage } from '../pages/PortalHomePage'
import { PortalSectionPage } from '../pages/PortalSectionPage'
import { TeacherClassStudentsPage } from '../pages/TeacherClassStudentsPage'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    path: '/login',
    element: (
      <GuestOnly>
        <LoginPage />
      </GuestOnly>
    ),
  },
  {
    path: '/teacher',
    element: (
      <RequireAuth>
        <PortalLayout role="teacher" />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/teacher/home" replace /> },
      { path: 'home', element: <PortalHomePage role="teacher" /> },
      {
        path: 'grades',
        element: (
          <TeacherClassStudentsPage
            title="성적관리"
            description="담당 학급 학생 목록과 성적 입력(추후 연동). 학생 계정을 추가하면 목록에 표시됩니다."
          />
        ),
      },
      {
        path: 'records',
        element: (
          <TeacherClassStudentsPage
            title="학생부 관리"
            description="담당 학급 학생 정보 관리. 학생 추가 시 학생부·로그인에 동일하게 반영됩니다."
          />
        ),
      },
      {
        path: 'feedback',
        element: (
          <PortalSectionPage
            title="피드백"
            description="학생별 피드백 작성 및 공개 범위 설정 화면"
          />
        ),
      },
      {
        path: 'counseling',
        element: (
          <PortalSectionPage
            title="상담"
            description="상담 내역 기록 및 업데이트 확인 화면"
          />
        ),
      },
    ],
  },
  {
    path: '/student',
    element: (
      <RequireAuth>
        <PortalLayout role="student" />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/student/home" replace /> },
      { path: 'home', element: <PortalHomePage role="student" /> },
      {
        path: 'grades',
        element: (
          <PortalSectionPage
            title="성적"
            description="학생 본인의 성적 조회 화면"
          />
        ),
      },
      {
        path: 'records',
        element: (
          <PortalSectionPage
            title="학생부"
            description="학생 본인의 학생부 조회 화면"
          />
        ),
      },
      {
        path: 'feedback',
        element: (
          <PortalSectionPage
            title="피드백"
            description="학생 본인의 피드백 조회 화면"
          />
        ),
      },
      {
        path: 'counseling',
        element: (
          <PortalSectionPage
            title="상담"
            description="학생 본인의 상담 내역 조회 화면"
          />
        ),
      },
    ],
  },
  {
    path: '/parent',
    element: (
      <RequireAuth>
        <PortalLayout role="parent" />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/parent/home" replace /> },
      { path: 'home', element: <PortalHomePage role="parent" /> },
      {
        path: 'grades',
        element: (
          <PortalSectionPage
            title="성적"
            description="자녀 성적 조회 화면"
          />
        ),
      },
      {
        path: 'records',
        element: (
          <PortalSectionPage
            title="학생부"
            description="자녀 학생부 조회 화면"
          />
        ),
      },
      {
        path: 'feedback',
        element: (
          <PortalSectionPage
            title="피드백"
            description="자녀 피드백 조회 화면"
          />
        ),
      },
      {
        path: 'counseling',
        element: (
          <PortalSectionPage
            title="상담"
            description="자녀 상담 내역 조회 화면"
          />
        ),
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
