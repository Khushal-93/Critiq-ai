import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateGithubUser(user: any) {
    let existingUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!existingUser) {
      existingUser = await this.prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          githubId: String(user.githubId),
          provider: 'GITHUB',
          accessToken: user.accessToken,
        },
      });
    } else {
      existingUser = await this.prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          avatar: user.avatar,
          githubId: String(user.githubId),
          accessToken: user.accessToken,
        },
      });
    }

    const jwt = await this.jwtService.signAsync({
      sub: existingUser.id,
      email: existingUser.email,
    });

    return {
      accessToken: jwt,
      user: existingUser,
    };
  }
}