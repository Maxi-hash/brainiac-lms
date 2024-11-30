import { Controller, Get, Post, Delete, Param, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Permission } from './entities/role-permission.entity';
import { UserRole } from '../auth/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { RequirePermission } from './decorators/permission.decorator';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get(':role/permissions')
  @UseGuards(PermissionGuard)
  @RequirePermission(Permission.VIEW_USERS)
  @ApiOperation({ summary: 'Get permissions for a role' })
  @ApiResponse({ status: 200, description: 'Returns list of permissions' })
  async getPermissions(@Param('role') role: UserRole) {
    return this.rolesService.getPermissionsForRole(role);
  }

  @Post(':role/permissions')
  @UseGuards(PermissionGuard)
  @RequirePermission(Permission.ASSIGN_ROLES)
  @ApiOperation({ summary: 'Add permission to role' })
  @ApiResponse({ status: 201, description: 'Permission added successfully' })
  async addPermission(
    @Param('role') role: UserRole,
    @Body('permission') permission: Permission,
    @Body('userId') userId: string,
  ) {
    return this.rolesService.addPermissionToRole(role, permission, userId);
  }

  @Delete(':role/permissions/:permission')
  @UseGuards(PermissionGuard)
  @RequirePermission(Permission.ASSIGN_ROLES)
  @ApiOperation({ summary: 'Remove permission from role' })
  @ApiResponse({ status: 200, description: 'Permission removed successfully' })
  async removePermission(
    @Param('role') role: UserRole,
    @Param('permission') permission: Permission,
    @Body('userId') userId: string,
  ) {
    await this.rolesService.removePermissionFromRole(role, permission, userId);
    return { message: 'Permission removed successfully' };
  }
}