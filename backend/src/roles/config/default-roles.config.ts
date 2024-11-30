import { UserRole } from '../../auth/entities/user.entity';
import { Permission } from '../entities/role-permission.entity';

type RoleConfig = {
  [key in UserRole]: {
    description: string;
    defaultPermissions: Permission[];
  };
};

export const defaultRoleConfig: RoleConfig = {
  [UserRole.ADMIN]: {
    description: 'Full system access with all permissions',
    defaultPermissions: Object.values(Permission),
  },
  [UserRole.MANAGER]: {
    description: 'Manage courses, users, and view analytics',
    defaultPermissions: [
      Permission.VIEW_USERS,
      Permission.MANAGE_USERS,
      Permission.VIEW_COURSES,
      Permission.CREATE_COURSES,
      Permission.EDIT_COURSES,
      Permission.PUBLISH_COURSES,
      Permission.VIEW_ANALYTICS,
      Permission.EXPORT_REPORTS,
      Permission.VIEW_GRADES,
    ],
  },
  [UserRole.TRAINER]: {
    description: 'Create and manage courses, assess students',
    defaultPermissions: [
      Permission.VIEW_COURSES,
      Permission.CREATE_COURSES,
      Permission.EDIT_COURSES,
      Permission.MANAGE_CONTENT,
      Permission.UPLOAD_FILES,
      Permission.CREATE_ASSESSMENTS,
      Permission.GRADE_ASSESSMENTS,
      Permission.VIEW_GRADES,
    ],
  },
  [UserRole.STUDENT]: {
    description: 'Access courses and track progress',
    defaultPermissions: [
      Permission.VIEW_COURSES,
      Permission.VIEW_GRADES,
    ],
  },
};