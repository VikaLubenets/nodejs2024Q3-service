import { Controller, Get } from '@nestjs/common';

@Controller('Album')
export class AlbumController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
