import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as QRCode from 'qrcode';

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async generateSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      'Brainiac LMS',
      secret,
    );

    await this.usersRepository.update(user.id, {
      twoFactorSecret: secret,
      twoFactorEnabled: false,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
    return { secret, qrCodeDataUrl };
  }

  async verifyToken(user: User, token: string): Promise<boolean> {
    return authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    });
  }

  async enableTwoFactor(user: User, token: string): Promise<boolean> {
    const isValid = await this.verifyToken(user, token);
    if (isValid) {
      await this.usersRepository.update(user.id, {
        twoFactorEnabled: true,
      });
      return true;
    }
    return false;
  }

  async disableTwoFactor(user: User): Promise<void> {
    await this.usersRepository.update(user.id, {
      twoFactorSecret: null,
      twoFactorEnabled: false,
    });
  }
}