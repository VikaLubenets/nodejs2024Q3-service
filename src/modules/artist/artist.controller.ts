import { Controller, Get } from '@nestjs/common';

@Controller('Artist')
export class ArtistController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
