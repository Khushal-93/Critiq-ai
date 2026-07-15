import { Controller, Get, Req, UseGuards, Body, Post} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RepositoriesService } from './repositories.service';
import { ImportRepositoryDto } from './dto/import-repository.dto';

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

  @Post('import')
@UseGuards(JwtAuthGuard)
async importRepository(
  @Req() req: any,
  @Body() dto: ImportRepositoryDto,
) {
  return this.repositoriesService.importRepository(
    req.user.userId,
    dto,
  );
}
}

