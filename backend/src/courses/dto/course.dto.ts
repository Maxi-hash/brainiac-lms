import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsArray, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to Programming' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn the basics of programming with this comprehensive course' })
  @IsString()
  description: string;

  @ApiProperty({ enum: CourseStatus, example: CourseStatus.DRAFT })
  @IsEnum(CourseStatus)
  status: CourseStatus;

  @ApiProperty({ example: ['programming', 'beginner'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: ['123e4567-e89b-12d3-a456-426614174000'] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  instructorIds?: string[];
}

export class UpdateCourseDto extends CreateCourseDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}