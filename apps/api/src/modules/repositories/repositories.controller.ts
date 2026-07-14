import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RepositoriesService } from './repositories.service';

@Controller('repositories')
export class RepositoriesController {
  constructor(
    private readonly repositoriesService: RepositoriesService,
  ) {}

  @Get('github')
  @UseGuards(JwtAuthGuard)
  async githubRepositories(@Req() req: any) {
    return this.repositoriesService.getGithubRepositories(
      req.user.userId,
    );
  }
}