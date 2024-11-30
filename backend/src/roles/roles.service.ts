import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission, Permission } from './entities/role-permission.entity';
import { UserRole } from '../auth/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async getPermissionsForRole(role: UserRole): Promise<Permission[]> {
    const rolePermissions = await this.rolePermissionRepository.find({
      where: { role, isActive: true },
    });
    return rolePermissions.map(rp => rp.permission);
  }

  async addPermissionToRole(role: UserRole, permission: Permission, userId: string): Promise<RolePermission> {
    const existingPermission = await this.rolePermissionRepository.findOne({
      where: { role, permission },
    });

    if (existingPermission && existingPermission.isActive) {
      throw new ConflictException('Permission already assigned to role');
    }

    if (existingPermission) {
      existingPermission.isActive = true;
      existingPermission.updatedBy = userId;
      return this.rolePermissionRepository.save(existingPermission);
    }

    const rolePermission = this.rolePermissionRepository.create({
      role,
      permission,
      createdBy: userId,
    });

    return this.rolePermissionRepository.save(rolePermission);
  }

  async removePermissionFromRole(role: UserRole, permission: Permission, userId: string): Promise<void> {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: { role, permission, isActive: true },
    });

    if (!rolePermission) {
      throw new NotFoundException('Permission not found for role');
    }

    rolePermission.isActive = false;
    rolePermission.updatedBy = userId;
    await this.rolePermissionRepository.save(rolePermission);
  }

  async hasPermission(role: UserRole, permission: Permission): Promise<boolean> {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: { role, permission, isActive: true },
    });
    return !!rolePermission;
  }
}