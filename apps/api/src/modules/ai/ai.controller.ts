import { Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('review')
  async review() {
    const code = `
function login(user){
    return true;
}
`;

    return this.aiService.reviewCode(
      code,
      'typescript',
    );
  }
}