import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PasswordService } from '../../auth/password.service';
import * as csv from 'csv-parse';
import * as XLSX from 'xlsx';

@Injectable()
export class UserImportService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private passwordService: PasswordService,
  ) {}

  async importUsersFromCsv(fileBuffer: Buffer) {
    return new Promise((resolve, reject) => {
      const results = [];
      const parser = csv.parse({
        columns: true,
        skip_empty_lines: true,
      });

      parser.on('readable', async () => {
        let record;
        while ((record = parser.read())) {
          try {
            const user = await this.createUserFromRecord(record);
            results.push(user);
          } catch (error) {
            results.push({ error: error.message, record });
          }
        }
      });

      parser.on('error', reject);
      parser.on('end', () => resolve(results));

      parser.write(fileBuffer);
      parser.end();
    });
  }

  async importUsersFromExcel(fileBuffer: Buffer) {
    const workbook = XLSX.read(fileBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const records = XLSX.utils.sheet_to_json(worksheet);

    const results = [];
    for (const record of records) {
      try {
        const user = await this.createUserFromRecord(record);
        results.push(user);
      } catch (error) {
        results.push({ error: error.message, record });
      }
    }

    return results;
  }

  private async createUserFromRecord(record: any) {
    const hashedPassword = await this.passwordService.hash(record.password || 'changeme123');
    
    const user = this.usersRepository.create({
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      role: record.role,
      section: record.section,
      managerId: record.managerId,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }
}