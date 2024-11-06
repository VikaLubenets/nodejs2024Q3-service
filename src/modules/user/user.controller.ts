import { Controller, Get } from '@nestjs/common';

@Controller('Users')
export class UsersController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
