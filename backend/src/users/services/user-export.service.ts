import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class UserExportService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async exportUsersToExcel(filters?: any) {
    const users = await this.usersRepository.find({
      where: filters,
      relations: ['manager'],
    });

    const data = users.map(user => ({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      section: user.section,
      manager: user.manager ? `${user.manager.firstName} ${user.manager.lastName}` : '',
      isActive: user.isActive,
      lastLogin: user.lastLoginAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  async exportUsersToCsv(filters?: any) {
    const users = await this.usersRepository.find({
      where: filters,
      relations: ['manager'],
    });

    const data = users.map(user => ({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      section: user.section,
      manager: user.manager ? `${user.manager.firstName} ${user.manager.lastName}` : '',
      isActive: user.isActive,
      lastLogin: user.lastLoginAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    return XLSX.utils.sheet_to_csv(worksheet);
  }
}