import { Navigate } from 'react-router';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Role } from '@/shared/laundry-types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, needsProfileCompletion } = useAuth();

  if (needsProfileCompletion) {
    return <Navigate to="/complete-profile" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <>{children}</>;
}
