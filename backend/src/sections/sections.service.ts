import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from './entities/section.entity';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { ActivityService } from '../activity/activity.service';
import { ActivityType } from '../activity/entities/activity-log.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
    private activityService: ActivityService,
  ) {}

  async createSection(createSectionDto: CreateSectionDto, userId: string) {
    const section = this.sectionRepository.create(createSectionDto);
    const savedSection = await this.sectionRepository.save(section);

    await this.activityService.logActivity({
      userId,
      type: ActivityType.SECTION_CHANGE,
      metadata: {
        action: 'create',
        sectionName: section.name,
      },
      sectionId: savedSection.id,
    });

    return savedSection;
  }

  async updateSection(id: string, updateSectionDto: UpdateSectionDto, userId: string) {
    const section = await this.sectionRepository.findOne({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    const oldValues = { ...section };
    Object.assign(section, updateSectionDto);
    const updatedSection = await this.sectionRepository.save(section);

    await this.activityService.logActivity({
      userId,
      type: ActivityType.SECTION_CHANGE,
      metadata: {
        action: 'update',
        oldValues,
        newValues: updateSectionDto,
      },
      sectionId: id,
    });

    return updatedSection;
  }

  async getSectionsByManager(managerId: string) {
    return this.sectionRepository.find({
      where: { managerId, isActive: true },
      relations: ['members'],
    });
  }

  async getSectionMembers(sectionId: string) {
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
      relations: ['members'],
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    return section.members;
  }

  async deactivateSection(id: string, userId: string) {
    const section = await this.sectionRepository.findOne({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    section.isActive = false;
    await this.sectionRepository.save(section);

    await this.activityService.logActivity({
      userId,
      type: ActivityType.SECTION_CHANGE,
      metadata: {
        action: 'deactivate',
        sectionName: section.name,
      },
      sectionId: id,
    });
  }
}