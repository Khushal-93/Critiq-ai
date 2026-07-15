import { Controller, Get, Req, UseGuards, Body, Post, Delete, Param } from '@nestjs/common';


import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RepositoriesService } from './repositories.service';
import { ImportRepositoryDto } from './dto/import-repository.dto';

@Controller('repositories')
export class RepositoriesController {
  constructor(
    private readonly repositoriesService: RepositoriesService,
  ) { }

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
  @Get()
  @UseGuards(JwtAuthGuard)
  async getImportedRepositories(@Req() req: any) {
    return this.repositoriesService.getImportedRepositories(
      req.user.userId,
    );
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteRepository(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.repositoriesService.deleteRepository(
      req.user.userId,
      id,
    );
  }
  @Post(':id/clone')
  @UseGuards(JwtAuthGuard)
  async cloneRepository(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.repositoriesService.cloneRepository(
      id,
      req.user.userId,
    );
  }
}

