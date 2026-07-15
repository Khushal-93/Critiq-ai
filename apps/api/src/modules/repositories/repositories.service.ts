import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Octokit } from '@octokit/rest';

import { PrismaService } from '../../prisma/prisma.service';
import { ImportRepositoryDto } from './dto/import-repository.dto';

@Injectable()
export class RepositoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getGithubRepositories(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.accessToken) {
      throw new UnauthorizedException('GitHub account not connected');
    }

    const octokit = new Octokit({
      auth: user.accessToken,
    });

    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
    });

    return data.map((repo) => ({
      githubId: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      language: repo.language,
      defaultBranch: repo.default_branch,
      githubUrl: repo.html_url,
    }));
  }

  async importRepository(
    userId: string,
    dto: ImportRepositoryDto,
  ) {
    return this.prisma.repository.create({
      data: {
        ownerId: userId,
        name: dto.name,
        description: dto.description,
        githubUrl: dto.githubUrl,
        language: dto.language,
        defaultBranch: dto.defaultBranch,
        visibility: dto.visibility,
      },
    });
  }
}