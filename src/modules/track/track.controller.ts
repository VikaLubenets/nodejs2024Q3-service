import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './type';
import { CreateTrackDto, UpdateTrackDto } from './dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async findAll(): Promise<Track[]> {
    return this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<Track> {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new HttpException("Record with the provided id doesn't exist", HttpStatus.NOT_FOUND);
    }
    return track;
  }

  @Post()
  async createTrack(@Body() dto: CreateTrackDto): Promise<Track> {
    return this.trackService.createTrack(dto);
  }

  @Put(':id')
  async updateTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateTrackDto,
  ): Promise<Track> {
    const updatedTrack = await this.trackService.updateTrack(id, dto);
    if (!updatedTrack) {
      throw new HttpException("Record with the provided id doesn't exist", HttpStatus.NOT_FOUND);
    }
    return updatedTrack;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> { 
    const result = await this.trackService.deleteTrack(id);
    if (!result) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
  }
}
