import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../../auth/entities/user.entity';

export enum Permission {
  // User Management
  VIEW_USERS = 'view_users',
  MANAGE_USERS = 'manage_users',
  ASSIGN_ROLES = 'assign_roles',

  // Course Management
  VIEW_COURSES = 'view_courses',
  CREATE_COURSES = 'create_courses',
  EDIT_COURSES = 'edit_courses',
  DELETE_COURSES = 'delete_courses',
  PUBLISH_COURSES = 'publish_courses',

  // Content Management
  MANAGE_CONTENT = 'manage_content',
  UPLOAD_FILES = 'upload_files',

  // Assessment Management
  CREATE_ASSESSMENTS = 'create_assessments',
  GRADE_ASSESSMENTS = 'grade_assessments',
  VIEW_GRADES = 'view_grades',

  // Analytics
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_REPORTS = 'export_reports',

  // System Settings
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_LOGS = 'view_logs'
}

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: Permission
  })
  permission: Permission;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;
}