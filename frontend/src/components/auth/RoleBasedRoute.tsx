import { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { UserRole } from '../../types/auth';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export function RoleBasedRoute({
  children,
  allowedRoles,
  fallback = null,
}: RoleBasedRouteProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}