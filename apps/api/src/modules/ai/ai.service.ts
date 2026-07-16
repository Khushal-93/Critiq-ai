import { Injectable } from '@nestjs/common';
import { OllamaProvider } from './providers/ollama.provider';
import { buildReviewPrompt } from './prompts/review.prompt';

@Injectable()
export class AiService {
  private readonly ollama = new OllamaProvider();

  async reviewCode(code: string, language: string) {
  const prompt = buildReviewPrompt(code, language);

  return this.ollama.review(prompt);
}
}