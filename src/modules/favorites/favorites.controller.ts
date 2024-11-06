import { Controller, Get } from '@nestjs/common';

@Controller('Favorites')
export class FavoritesController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
