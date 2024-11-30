import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsOptional, IsUUID, IsObject } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  section?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  managerId?: string;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  section?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  managerId?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  preferences?: {
    notifications?: {
      contentUpdates?: boolean;
      peerFeedback?: boolean;
      managerApproval?: boolean;
    };
    defaultSection?: string;
  };
}