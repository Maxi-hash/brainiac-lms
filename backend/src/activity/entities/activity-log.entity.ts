import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ActivityType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PROFILE_UPDATE = 'profile_update',
  PASSWORD_CHANGE = 'password_change',
  CONTENT_CREATE = 'content_create',
  CONTENT_UPDATE = 'content_update',
  SECTION_CHANGE = 'section_change',
  ROLE_CHANGE = 'role_change',
  NOTIFICATION_UPDATE = 'notification_update'
}

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ActivityType
  })
  type: ActivityType;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    ip?: string;
    userAgent?: string;
    oldValue?: any;
    newValue?: any;
    details?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  sectionId?: string;
}