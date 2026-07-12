import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getCurrentUser() {
    return {
      id: '1',
      username: 'khushal',
      email: 'khushal@example.com',
      avatar: 'https://github.com/github.png',
    };
  }
}