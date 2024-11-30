import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsBoolean, IsObject, IsOptional } from 'class-validator';
import { UserRole } from '../../auth/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: true })
  @IsBoolean()
  isEmailVerified: boolean;

  @ApiProperty({
    example: {
      language: 'en',
      theme: 'light',
      notifications: { email: true, push: false }
    }
  })
  @IsObject()
  @IsOptional()
  preferences?: Record<string, any>;
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
  @IsObject()
  @IsOptional()
  preferences?: Record<string, any>;
}