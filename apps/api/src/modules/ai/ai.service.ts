import { Injectable } from '@nestjs/common';
import { OllamaProvider } from './providers/ollama.provider';
import { buildReviewPrompt } from './prompts/review.prompt';

@Injectable()
export class AiService {
    private readonly ollama = new OllamaProvider();

    async reviewCode(code: string, language: string) {
        const prompt = buildReviewPrompt(code, language);

        const response = await this.ollama.review(prompt);

        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

            console.log("========== RAW AI RESPONSE ==========");
console.log(cleaned);
console.log("=====================================");
        return JSON.parse(cleaned);
    }
}