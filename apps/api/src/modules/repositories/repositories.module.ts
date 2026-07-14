import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';
import { GithubService } from './github/github.service';

@Module({
  imports: [PrismaModule],
  controllers: [RepositoriesController],
  providers: [RepositoriesService, GithubService],
  exports: [RepositoriesService],
})
export class RepositoriesModule {}