import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog, ActivityType } from './entities/activity-log.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async logActivity(data: {
    userId: string;
    type: ActivityType;
    metadata?: any;
    sectionId?: string;
  }) {
    const activityLog = this.activityLogRepository.create(data);
    return this.activityLogRepository.save(activityLog);
  }

  async getUserActivities(userId: string) {
    return this.activityLogRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSectionActivities(sectionId: string) {
    return this.activityLogRepository.find({
      where: { sectionId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getRecentActivities(limit: number = 10) {
    return this.activityLogRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}