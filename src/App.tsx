import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StudentPage, FacultyPage, AdminPage, Dashboard, Landing } from './pages';
import MentorDashboard from './components/mentorComponents/MentorDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode; redirectTo: string }> = ({ children, redirectTo }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} replace />;
};

// Role guard: ensures only users with the right role can access a route, otherwise redirects to their own dashboard
const RoleProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: Array<'admin' | 'mentor' | 'student'> }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const normalizedRole = user?.userType === 'faculty' ? 'mentor' : (user?.userType as 'admin' | 'mentor' | 'student' | undefined);

  if (!normalizedRole) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowedRoles.includes(normalizedRole)) {
    // Redirect to the correct dashboard for the current role
    if (normalizedRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (normalizedRole === 'mentor') return <Navigate to="/faculty/dashboard" replace />;
    if (normalizedRole === 'student') return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
};

// Role-based Dashboard Component
const RoleDashboard: React.FC = () => {
  const { user } = useAuth();
  const [demoRole, setDemoRole] = useState<'admin' | 'mentor' | null>(null);
  
  // Use demo role if set, otherwise use actual user role
  const effectiveRole = demoRole || (user?.userType === 'faculty' ? 'mentor' : user?.userType);
  
  return (
    <>
      {effectiveRole === 'admin' ? <Dashboard /> : <MentorDashboard />}
      
      
    </>
  );
};

const StudentPageWithAuth: React.FC = () => {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <StudentPage onLogin={login} />;
};

const FacultyPageWithAuth: React.FC = () => {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/faculty/dashboard" replace />;
  }

  return <FacultyPage onLogin={login} />;
};

const LandingWithAuth: React.FC = () => {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Landing onLogin={login} />;
};

const AdminPageWithAuth: React.FC = () => {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminPage onLogin={login} />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingWithAuth />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminPageWithAuth />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute redirectTo="/admin/login">
            <RoleProtectedRoute allowedRoles={['admin']}>
              <RoleDashboard />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* Faculty/Mentor Routes */}
      <Route path="/faculty/login" element={<FacultyPageWithAuth />} />
      <Route path="/mentor/login" element={<FacultyPageWithAuth />} />
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute redirectTo="/faculty/login">
            <RoleProtectedRoute allowedRoles={['mentor']}>
              <RoleDashboard />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/dashboard"
        element={
          <ProtectedRoute redirectTo="/mentor/login">
            <RoleProtectedRoute allowedRoles={['mentor']}>
              <RoleDashboard />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route path="/student/login" element={<StudentPageWithAuth />} />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute redirectTo="/student/login">
            <RoleProtectedRoute allowedRoles={['student']}>
              <RoleDashboard />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* Redirect authenticated users to appropriate dashboard */}
      {isAuthenticated && (
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      )}
      
      {/* Redirect unauthenticated users to admin login */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;

