import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

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
}