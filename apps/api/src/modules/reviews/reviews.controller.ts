import { Controller, Post, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
  ) {}

  @Post(':repositoryId')
async review(
  @Param('repositoryId') repositoryId: string,
) {
  return this.reviewsService.reviewRepository(
    repositoryId,
  );
}
  }
