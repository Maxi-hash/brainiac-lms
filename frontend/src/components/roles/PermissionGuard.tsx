import React, { ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Permission } from '../../types/roles';

interface PermissionGuardProps {
  children: ReactNode;
  permission: Permission;
  fallback?: ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  fallback = null,
}: PermissionGuardProps) {
  const { user } = useAuth();

  const hasPermission = user?.permissions?.includes(permission);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}