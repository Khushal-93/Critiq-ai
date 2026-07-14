import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubLogin() {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(@Req() req: any) {
    return await this.authService.validateGithubUser(req.user);
  }
}