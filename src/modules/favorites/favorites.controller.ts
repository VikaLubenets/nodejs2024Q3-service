import { Controller, Get, Post, Delete, Param, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  getAllFavorites() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  async addTrackToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.addFavorite('tracks', id);
    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrackFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.removeFavorite('tracks', id);
  }

  @Post('album/:id')
  async addAlbumToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.addFavorite('albums', id);
    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbumFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.removeFavorite('albums', id);
  }

  @Post('artist/:id')
  async addArtistToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.addFavorite('artists', id);
    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtistFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.removeFavorite('artists', id);
  }
}
