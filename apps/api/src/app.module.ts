import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RepositoriesModule } from './modules/repositories/repositories.module';
import { GitModule } from './modules/git/git.module';
import { ScannerModule } from './modules/scanner/scanner.module';
import { AiModule } from './modules/ai/ai.module';
import { ReviewsModule } from './modules/reviews/reviews.module';



@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    RepositoriesModule,
    GitModule,
    ScannerModule,
    AiModule,
    ReviewsModule,
  ],
})
export class AppModule {}