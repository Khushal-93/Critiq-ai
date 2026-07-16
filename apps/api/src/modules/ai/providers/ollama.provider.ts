import axios from 'axios';

export class OllamaProvider {
  async review(prompt: string) {
    const { data } = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'qwen2.5-coder:7b',
        prompt,
        stream: false,
      },
    );

    return data.response;
  }
}