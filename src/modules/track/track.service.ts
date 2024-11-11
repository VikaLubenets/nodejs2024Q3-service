import { Injectable } from '@nestjs/common';
import { Track } from './type';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto, UpdateTrackDto } from './dto';

@Injectable()
export class TrackService {
  private storage: Track[] = [];

  async findAll(): Promise<Track[]> {
    return this.storage;
  }

  async findOne(id: string): Promise<Track | undefined> {
    return this.storage.find((track) => track.id === id);
  }

  async createTrack(dto: CreateTrackDto): Promise<Track> {
    const newTrack: Track = {
      ...dto,
      id: uuidv4(),
    };
    this.storage.push(newTrack);
    return newTrack;
  }

  async updateTrack(id: string, dto: UpdateTrackDto): Promise<Track | null> {
    const trackIndex = this.storage.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      return null;
    }
    const track = this.storage[trackIndex];

    const updatedTrack: Track = {
      ...track,
      ...dto,
    };
    this.storage[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  async deleteTrack(id: string): Promise<boolean> {
    const trackIndex = this.storage.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      return false;
    }
    this.storage.splice(trackIndex, 1);
    return true;
  }
}
