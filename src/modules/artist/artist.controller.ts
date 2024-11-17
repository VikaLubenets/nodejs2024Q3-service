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

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async findAll(): Promise<Artist[]> {
    return this.artistService.findAll();
  }

  @Get(':id')
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
  async createArtist(@Body() dto: CreateArtistDto): Promise<Artist> {
    return this.artistService.createArtist(dto);
  }

  @Put(':id')
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
