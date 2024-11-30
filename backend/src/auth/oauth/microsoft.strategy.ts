import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { AuthService } from '../auth.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/microsoft/callback',
      scope: ['user.read'],
      tenant: 'common',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    const user = {
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      provider: 'microsoft',
      providerId: profile.id,
    };

    return this.authService.findOrCreateOAuthUser(user);
  }
}