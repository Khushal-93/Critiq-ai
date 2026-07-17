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

        // Verify repository exists
        const repository = await this.prisma.repository.findUnique({
            where: {
                id: repositoryId,
            },
        });

        if (!repository) {
            throw new Error('Repository not found');
        }

        // Create review
        const reviewRecord = await this.prisma.review.create({
            data: {
                repositoryId,
                status: 'RUNNING',
                startedAt: new Date(),
            },
        });

        console.log(`Created review: ${reviewRecord.id}`);

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
        // Review only first 3 chunks for testing
        for (const chunk of chunks.slice(0, 3)) {
            try {
                console.log(
                    `Reviewing ${chunk.filePath} (${chunk.chunkNumber}/${chunk.totalChunks})`,
                );

                const review = await this.ai.reviewCode(
                    chunk.content,
                    chunk.language,
                );

                console.log('Review completed');

                for (const issue of review.issues) {
                    await this.prisma.issue.create({
                        data: {
                            reviewId: reviewRecord.id,

                            title: issue.title,
                            description: issue.description,

                            severity: this.mapSeverity(issue.severity),
                            category: this.mapCategory(issue.category),

                            filePath: chunk.filePath,
                            line: null,

                            suggestedFix: issue.suggestion,
                            explanation: review.summary,
                            confidence: 0.9,
                        },
                    });
                }

                reviews.push({
                    filePath: chunk.filePath,
                    chunkNumber: chunk.chunkNumber,
                    review,
                });

            } catch (error) {
                console.error(
                    `Failed to review ${chunk.filePath}`,
                    error,
                );

                continue;
            }
        }

        await this.prisma.review.update({
    where: {
        id: reviewRecord.id,
    },
    data: {
        status: 'COMPLETED',
        completedAt: new Date(),
    },
});

console.log('Finished reviewing!');


        return reviews;
    }
    private mapSeverity(severity: string) {
        switch (severity.toUpperCase()) {
            case 'INFO':
                return 'INFO';
            case 'LOW':
                return 'LOW';
            case 'MEDIUM':
                return 'MEDIUM';
            case 'HIGH':
                return 'HIGH';
            case 'CRITICAL':
                return 'CRITICAL';
            default:
                return 'LOW';
        }
    }

    private mapCategory(category: string) {
        switch (category.toLowerCase()) {
            case 'security':
                return 'SECURITY';

            case 'performance':
                return 'PERFORMANCE';

            case 'bug':
                return 'BUG';

            case 'code smell':
                return 'MAINTAINABILITY';

            case 'best practice violation':
                return 'BEST_PRACTICE';

            case 'architecture':
                return 'ARCHITECTURE';

            case 'maintainability':
                return 'MAINTAINABILITY';

            case 'style':
                return 'STYLE';

            default:
                return 'STYLE';
        }
    }

}