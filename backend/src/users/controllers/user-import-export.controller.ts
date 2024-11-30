import { Controller, Post, Get, UseGuards, Query, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserImportService } from '../services/user-import.service';
import { UserExportService } from '../services/user-export.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserImportExportController {
  constructor(
    private readonly userImportService: UserImportService,
    private readonly userExportService: UserExportService,
  ) {}

  @Post('import')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import users from CSV or Excel file' })
  async importUsers(@UploadedFile() file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    let results;

    if (fileExtension === 'csv') {
      results = await this.userImportService.importUsersFromCsv(file.buffer);
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      results = await this.userImportService.importUsersFromExcel(file.buffer);
    } else {
      throw new Error('Unsupported file format');
    }

    return {
      message: 'Import completed',
      results,
      errors: results.filter(r => r.error),
    };
  }

  @Get('export')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Export users to CSV or Excel' })
  async exportUsers(@Query('format') format: 'csv' | 'excel' = 'excel') {
    if (format === 'csv') {
      const csv = await this.userExportService.exportUsersToCsv();
      return {
        data: csv,
        filename: 'users.csv',
        contentType: 'text/csv',
      };
    } else {
      const excel = await this.userExportService.exportUsersToExcel();
      return {
        data: excel,
        filename: 'users.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };
    }
  }
}