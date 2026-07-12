import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      name: 'Critiq API',
      status: 'healthy',
      version: '0.0.1',
      message: 'Welcome to Critiq 🚀',
    };
  }
}