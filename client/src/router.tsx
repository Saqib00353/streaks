import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import LoginPage from '@/modules/auth/pages/login-page'
import RegisterPage from '@/modules/auth/pages/register-page'
import DashboardPage from '@/modules/dashboard/pages/dashboard-page'
import { ProtectedRoute } from '@/modules/auth/protected-route'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <DashboardPage /> }],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
