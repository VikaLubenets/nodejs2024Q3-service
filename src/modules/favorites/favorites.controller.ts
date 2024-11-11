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
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FavoritesDto } from './dto/favorites.dto';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites (artists, albums, tracks)' })
  @ApiResponse({
    status: 200,
    description: 'Returns favorite artists, albums, and tracks',
    type: FavoritesDto,
  })
  getAllFavorites() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @ApiOperation({ summary: 'Add a track to favorites' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the track to add to favorites',
  })
  @ApiResponse({ status: 200, description: 'Track added to favorites' })
  @ApiResponse({ status: 400, description: 'Invalid track ID (not a UUID)' })
  @ApiResponse({ status: 422, description: 'Track does not exist' })
  async addTrackToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    const track = await this.trackService.findOne(id);
    if (!track)
      throw new HttpException(
        "Track doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.favoritesService.addFavorite('tracks', id);
    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @ApiOperation({ summary: 'Remove a track from favorites' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the track to remove from favorites',
  })
  @ApiResponse({ status: 204, description: 'Track removed from favorites' })
  @ApiResponse({ status: 400, description: 'Invalid track ID (not a UUID)' })
  @ApiResponse({ status: 404, description: 'Track is not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrackFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.removeFavorite('tracks', id);
  }

  @Post('album/:id')
  @ApiOperation({ summary: 'Add an album to favorites' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the album to add to favorites',
  })
  @ApiResponse({ status: 200, description: 'Album added to favorites' })
  @ApiResponse({ status: 400, description: 'Invalid album ID (not a UUID)' })
  @ApiResponse({ status: 422, description: 'Album does not exist' })
  async addAlbumToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    const album = await this.albumService.findOne(id);
    if (!album)
      throw new HttpException(
        "Album doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.favoritesService.addFavorite('albums', id);
    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @ApiOperation({ summary: 'Remove an album from favorites' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the album to remove from favorites',
  })
  @ApiResponse({ status: 204, description: 'Album removed from favorites' })
  @ApiResponse({ status: 400, description: 'Invalid album ID (not a UUID)' })
  @ApiResponse({ status: 404, description: 'Album is not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbumFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.removeFavorite('albums', id);
  }

  @Post('artist/:id')
  @ApiOperation({ summary: 'Add an artist to favorites' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the artist to add to favorites',
  })
  @ApiResponse({ status: 200, description: 'Artist added to favorites' })
  @ApiResponse({ status: 400, description: 'Invalid artist ID (not a UUID)' })
  @ApiResponse({ status: 422, description: 'Artist does not exist' })
  async addArtistToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    const artist = await this.artistService.findOne(id);
    if (!artist)
      throw new HttpException(
        "Artist doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.favoritesService.addFavorite('artists', id);
    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @ApiOperation({ summary: 'Remove an artist from favorites' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the artist to remove from favorites',
  })
  @ApiResponse({ status: 204, description: 'Artist removed from favorites' })
  @ApiResponse({ status: 400, description: 'Invalid artist ID (not a UUID)' })
  @ApiResponse({ status: 404, description: 'Artist is not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtistFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.removeFavorite('artists', id);
  }
}
