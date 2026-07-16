import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CodeChunk } from './interfaces/code-chunk.interface';

@Injectable()
export class ScannerService {
  private readonly ignoredFolders = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'coverage',
    '.turbo',
    '.idea',
    '.vscode',
  ];

  private readonly allowedExtensions = [
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.py',
    '.java',
    '.go',
    '.rs',
    '.cpp',
    '.c',
  ];

  scanDirectory(directory: string) {
    const files: {
      path: string;
      extension: string;
      size: number;
    }[] = [];

    const walk = (currentPath: string) => {
      const entries = fs.readdirSync(currentPath);

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          if (this.ignoredFolders.includes(entry)) {
            continue;
          }

          walk(fullPath);
        } else {
          const extension = path.extname(entry);

          if (this.allowedExtensions.includes(extension)) {
            files.push({
              path: fullPath,
              extension,
              size: stat.size,
            });
          }
        }
      }
    };

    walk(directory);

    return files;
  }

  readFiles(
    files: {
      path: string;
      extension: string;
      size: number;
    }[],
  ) {
    return files.map((file) => ({
      path: file.path,
      extension: file.extension,
      size: file.size,
      content: fs.readFileSync(file.path, 'utf-8'),
    }));
  }
  private getLanguage(extension: string): string {
    switch (extension) {
      case '.ts':
      case '.tsx':
        return 'typescript';

      case '.js':
      case '.jsx':
        return 'javascript';

      case '.py':
        return 'python';

      case '.java':
        return 'java';

      case '.go':
        return 'go';

      case '.rs':
        return 'rust';

      case '.cpp':
        return 'cpp';

      case '.c':
        return 'c';

      default:
        return 'text';
    }
  }

  chunkFiles(
    files: {
      path: string;
      extension: string;
      content: string;
    }[],
    chunkSize = 200,
  ) {
    const chunks: CodeChunk[] = [];

    for (const file of files) {
      const lines = file.content.split('\n');

      const totalChunks = Math.ceil(lines.length / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        chunks.push({
          filePath: file.path,
          language: this.getLanguage(file.extension),
          chunkNumber: i + 1,
          totalChunks,
          content: lines
            .slice(i * chunkSize, (i + 1) * chunkSize)
            .join('\n'),
        });
      }
    }

    return chunks;
  }
}