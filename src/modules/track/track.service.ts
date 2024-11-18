import { Injectable } from '@nestjs/common';
import { Track } from './type';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TrackService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<Track[]> {
    return this.db.track.findMany();
  }

  async findOne(id: string): Promise<Track | null> {
    return this.db.track.findUnique({ where: { id } });
  }

  async createTrack(dto: CreateTrackDto): Promise<Track> {
    return this.db.track.create({ data: dto });
  }

  async updateTrack(id: string, dto: UpdateTrackDto): Promise<Track | null> {
    const track = await this.db.track.findUnique({ where: { id } });

    if (!track) {
      return null;
    }

    return this.db.track.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTrack(id: string): Promise<boolean> {
    const track = await this.db.track.findUnique({ where: { id } });
    if (!track) {
      return false;
    }
    await this.db.track.delete({ where: { id } });
    return true;
  }
}
