import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AuthGuard } from './components/guards/AuthGuard';
import { RoleGuard } from './components/guards/RoleGuard';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import LeaveHistoryPage from './pages/LeaveHistoryPage';
import ApplyLeavePage from './pages/ApplyLeavePage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import ManagerRequestsPage from './pages/ManagerRequestsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          {/* Employee routes */}
          <Route path="/dashboard" element={<EmployeeDashboardPage />} />
          <Route path="/leave-history" element={<LeaveHistoryPage />} />
          <Route path="/apply-leave" element={<ApplyLeavePage />} />

          {/* Manager routes */}
          <Route
            path="/manager/dashboard"
            element={
              <RoleGuard roles={['MANAGER', 'ADMIN']}>
                <ManagerDashboardPage />
              </RoleGuard>
            }
          />
          <Route
            path="/manager/requests"
            element={
              <RoleGuard roles={['MANAGER', 'ADMIN']}>
                <ManagerRequestsPage />
              </RoleGuard>
            }
          />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
