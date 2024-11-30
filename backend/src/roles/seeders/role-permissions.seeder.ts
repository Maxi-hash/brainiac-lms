import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from '../entities/role-permission.entity';
import { defaultRoleConfig } from '../config/default-roles.config';

@Injectable()
export class RolePermissionsSeeder {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async seed() {
    for (const [role, config] of Object.entries(defaultRoleConfig)) {
      for (const permission of config.defaultPermissions) {
        const existingPermission = await this.rolePermissionRepository.findOne({
          where: { role, permission },
        });

        if (!existingPermission) {
          await this.rolePermissionRepository.save({
            role,
            permission,
            isActive: true,
            createdBy: 'system',
          });
        }
      }
    }
  }
}