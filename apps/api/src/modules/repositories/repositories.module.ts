import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';
import { GithubService } from './github/github.service';
import { GitModule } from '../git/git.module';

@Module({
  imports: [PrismaModule,GitModule],
  controllers: [RepositoriesController],
  providers: [RepositoriesService, GithubService],
  exports: [RepositoriesService],
})
export class RepositoriesModule {}