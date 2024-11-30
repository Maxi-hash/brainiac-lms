import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    const user = {
      email: profile.emails[0].value,
      firstName: profile.displayName?.split(' ')[0] || '',
      lastName: profile.displayName?.split(' ')[1] || '',
      provider: 'github',
      providerId: profile.id,
    };

    return this.authService.findOrCreateOAuthUser(user);
  }
}