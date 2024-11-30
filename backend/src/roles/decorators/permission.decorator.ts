import { SetMetadata } from '@nestjs/common';
import { Permission } from '../entities/role-permission.entity';

export const RequirePermission = (permission: Permission) =>
  SetMetadata('permission', permission);