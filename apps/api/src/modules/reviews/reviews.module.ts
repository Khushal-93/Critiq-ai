import { Module } from '@nestjs/common';

import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

import { PrismaModule } from '../../prisma/prisma.module';
import { ScannerModule } from '../scanner/scanner.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    ScannerModule,
    AiModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}