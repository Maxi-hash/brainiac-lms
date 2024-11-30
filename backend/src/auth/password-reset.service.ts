import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { PasswordService } from './password.service';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private passwordService: PasswordService,
  ) {}

  async sendPasswordResetEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '1h' },
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset Your Password',
      template: 'password-reset',
      context: {
        name: user.firstName,
        resetUrl,
      },
    });

    return true;
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await this.passwordService.hash(newPassword);
      await this.usersRepository.update(user.id, {
        password: hashedPassword,
        refreshToken: null,
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}