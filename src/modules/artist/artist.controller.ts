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
import { ArtistService } from './artist.service';
import { Artist } from './type';
import { CreateArtistDto, UpdateArtistDto } from './dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArtistEntity } from './dto/artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse({ status: 200, description: 'All artists' })
  async findAll(): Promise<Artist[]> {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artist by id' })
  @ApiResponse({ status: 200, description: 'Artist found', type: ArtistEntity })
  @ApiResponse({ status: 400, description: 'Invalid artist ID' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Artist> {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        "Record with the provided id doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return artist;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new artist' })
  @ApiResponse({
    status: 201,
    description: 'Artist created successfully',
    type: ArtistEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async createArtist(@Body() dto: CreateArtistDto): Promise<Artist> {
    return this.artistService.createArtist(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update artist' })
  @ApiResponse({
    status: 200,
    description: 'Artist updated successfully',
    type: ArtistEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid artist ID or data' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async updateArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateArtistDto,
  ): Promise<Artist> {
    const updatedArtist = await this.artistService.updateArtist(id, dto);
    if (!updatedArtist) {
      throw new HttpException(
        "Record with the provided id doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return updatedArtist;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete artist' })
  @ApiResponse({ status: 204, description: 'Artist deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid artist ID' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    const result = await this.artistService.deleteArtist(id);
    if (!result) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
  }
}
