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
import { TrackService } from './track.service';
import { Track } from './type';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TrackEntity } from './dto/track.entity';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiResponse({ status: 200, description: 'All tracks' })
  async findAll(): Promise<Track[]> {
    return this.trackService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get track by id' })
  @ApiResponse({ status: 200, description: 'Track found', type: TrackEntity })
  @ApiResponse({ status: 400, description: 'Invalid track ID' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Track> {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        "Record with the provided id doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return track;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new track' })
  @ApiResponse({
    status: 201,
    description: 'Track created successfully',
    type: TrackEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async createTrack(@Body() dto: CreateTrackDto): Promise<Track> {
    return this.trackService.createTrack(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update track' })
  @ApiResponse({
    status: 200,
    description: 'Track updated successfully',
    type: TrackEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid track ID or data' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  async updateTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateTrackDto,
  ): Promise<Track> {
    const updatedTrack = await this.trackService.updateTrack(id, dto);
    if (!updatedTrack) {
      throw new HttpException(
        "Record with the provided id doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return updatedTrack;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete track' })
  @ApiResponse({ status: 204, description: 'Track deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid track ID' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    const result = await this.trackService.deleteTrack(id);
    if (!result) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
  }
}
