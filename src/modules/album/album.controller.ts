import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './type';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AlbumEntity } from './dto/album.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiResponse({ status: 200, description: 'All albums' })
  async findAll(): Promise<Album[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album by id' })
  @ApiResponse({ status: 200, description: 'Album', type: AlbumEntity })
  @ApiResponse({ status: 400, description: 'Invalid album ID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Album> {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new HttpException(
        "Record with the provided id doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return album;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new album' })
  @ApiResponse({ status: 201, description: 'Album created', type: AlbumEntity })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async createAlbum(@Body() dto: CreateAlbumDto): Promise<Album> {
    return this.albumService.createAlbum(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update album' })
  @ApiResponse({
    status: 200,
    description: 'Album updated successfully',
    type: AlbumEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid album ID or data' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async updateArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateAlbumDto,
  ): Promise<Album> {
    const updatedAlbum = await this.albumService.updateAlbum(id, dto);
    if (!updatedAlbum) {
      throw new HttpException(
        "Record with the provided id doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return updatedAlbum;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete album' })
  @ApiResponse({ status: 204, description: 'Album deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid album ID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    const result = await this.albumService.deleteAlbum(id);
    if (!result) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
  }
}
