import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { ScannerService } from '../scanner/scanner.service';
import { AiService } from '../ai/ai.service';
import * as path from 'path';

@Injectable()
export class ReviewsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly scanner: ScannerService,
        private readonly ai: AiService,
    ) { }

    async reviewRepository(repositoryId: string) {
  const repositoryPath = `workspace/Critiq-ai`;

  console.log('1. Scanning repository...');

  const files = this.scanner.scanDirectory(repositoryPath);

  console.log(`Found ${files.length} files`);

  console.log('2. Reading files...');

  const contents = this.scanner.readFiles(files);

  console.log(`Read ${contents.length} files`);

  console.log('3. Chunking files...');

  const chunks = this.scanner.chunkFiles(contents);

  console.log(`Created ${chunks.length} chunks`);

  const reviews: any[] = [];

  // Review only first 3 chunks for testing
  for (const chunk of chunks.slice(0, 3)) {
    console.log(
      `Reviewing ${chunk.filePath} (${chunk.chunkNumber}/${chunk.totalChunks})`,
    );

    const review = await this.ai.reviewCode(
      chunk.content,
      chunk.language,
    );

    console.log('Review completed');

    reviews.push({
      filePath: chunk.filePath,
      chunkNumber: chunk.chunkNumber,
      review,
    });
  }

  console.log('Finished reviewing!');

  return reviews;
}

}