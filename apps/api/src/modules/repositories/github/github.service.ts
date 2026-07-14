import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';

@Injectable()
export class GithubService {
  async getRepositories(accessToken: string) {
    const octokit = new Octokit({
      auth: accessToken,
    });

    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
    });

    return data;
  }
}