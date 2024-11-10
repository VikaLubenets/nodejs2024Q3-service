import { Injectable } from '@nestjs/common';
import { Artist } from './type';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto, UpdateArtistDto } from './dto';

@Injectable()
export class ArtistService {
  private storage: Artist[] = [];

  async findAll(): Promise<Artist[]> {
    return this.storage;
  }

  async findOne(id: string): Promise<Artist | undefined> {
    return this.storage.find(artist => artist.id === id);
  }

  async createArtist(dto: CreateArtistDto): Promise<Artist> {
    const newArtist: Artist = {
      ...dto,
      id: uuidv4(),
    };
    this.storage.push(newArtist);
    return newArtist;
  }

  async updateArtist(id: string, dto: UpdateArtistDto): Promise<Artist | null> {
    const artistIndex = this.storage.findIndex(artist => artist.id === id);
    if (artistIndex === -1) {
      return null;
    }
    const artist = this.storage[artistIndex];

    const updatedArtist: Artist = {
      ...artist,
      ...dto,
    };
    this.storage[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  async deleteArtist(id: string): Promise<boolean> {
    const artistIndex = this.storage.findIndex(artist => artist.id === id);
    if (artistIndex === -1) {
      return false;
    }
    this.storage.splice(artistIndex, 1);
    return true;
  }
}
