import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Octokit } from '@octokit/rest';

import { PrismaService } from '../../prisma/prisma.service';
import { ImportRepositoryDto } from './dto/import-repository.dto';
import { GitService } from '../git/git.service';

@Injectable()
export class RepositoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gitService: GitService,
  ) { }

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
  async getImportedRepositories(userId: string) {
    return this.prisma.repository.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async deleteRepository(
    userId: string,
    repositoryId: string,
  ) {
    const repository = await this.prisma.repository.findUnique({
      where: {
        id: repositoryId,
      },
    });

    if (!repository) {
      throw new Error('Repository not found');
    }

    if (repository.ownerId !== userId) {
      throw new Error('Unauthorized');
    }

    await this.prisma.repository.delete({
      where: {
        id: repositoryId,
      },
    });

    return {
      message: 'Repository deleted successfully',
    };
  }
  async cloneRepository(
    repositoryId: string,
    userId: string,
  ) {
    const repository = await this.prisma.repository.findUnique({
      where: {
        id: repositoryId,
      },
    });

    if (!repository) {
      throw new Error('Repository not found');
    }

    if (repository.ownerId !== userId) {
      throw new Error('Unauthorized');
    }

    if (!repository.githubUrl) {
      throw new Error('Repository GitHub URL is missing');
    }

    return this.gitService.cloneRepository(
      repository.githubUrl,
      repository.name,
    );

  }
}