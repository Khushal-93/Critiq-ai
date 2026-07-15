import { Injectable } from '@nestjs/common';
import simpleGit from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GitService {
  async cloneRepository(
    repositoryUrl: string,
    repositoryName: string,
  ) {
    const workspace = path.join(process.cwd(), 'workspace');

    if (!fs.existsSync(workspace)) {
      fs.mkdirSync(workspace, { recursive: true });
    }

    const destination = path.join(
      workspace,
      repositoryName,
    );

    if (fs.existsSync(destination)) {
      return {
        message: 'Repository already cloned',
        path: destination,
      };
    }

    await simpleGit().clone(
      repositoryUrl,
      destination,
    );

    return {
      message: 'Repository cloned successfully',
      path: destination,
    };
  }
}