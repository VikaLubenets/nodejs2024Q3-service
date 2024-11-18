import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  @Get()
  async getAllFavorites() {
    const allFavs = await this.favoritesService.findAll();
    return allFavs;
  }

  @Post('track/:id')
  async addTrackToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    const track = await this.trackService.findOne(id);
    if (!track)
      throw new HttpException(
        "Track doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    await this.favoritesService.addFavorite('tracks', id);
    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrackFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.favoritesService.removeFavorite('tracks', id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('album/:id')
  async addAlbumToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    const album = await this.albumService.findOne(id);
    if (!album)
      throw new HttpException(
        "Album doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    await this.favoritesService.addFavorite('albums', id);
    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbumFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.favoritesService.removeFavorite('albums', id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('artist/:id')
  async addArtistToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    const artist = await this.artistService.findOne(id);
    if (!artist)
      throw new HttpException(
        "Artist doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    await this.favoritesService.addFavorite('artists', id);
    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtistFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.favoritesService.removeFavorite('artists', id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
