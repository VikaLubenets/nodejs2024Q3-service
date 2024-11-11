import { Injectable } from '@nestjs/common';
import { Album } from './type';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { TrackService } from '../track/track.service';

@Injectable()
export class AlbumService {
  private storage: Album[] = [];

  constructor(
    private readonly trackService: TrackService,
  ) {}

  async findAll(): Promise<Album[]> {
    return this.storage;
  }

  async findOne(id: string): Promise<Album | undefined> {
    return this.storage.find(album => album.id === id);
  }

  async createAlbum(dto: CreateAlbumDto): Promise<Album> {
    const newAlbum: Album = {
      ...dto,
      id: uuidv4(),
    };
    this.storage.push(newAlbum);
    return newAlbum;
  }

  async updateAlbum(id: string, dto: UpdateAlbumDto): Promise<Album | null> {
    const albumIndex = this.storage.findIndex(artist => artist.id === id);
    if (albumIndex === -1) {
      return null;
    }
    const album = this.storage[albumIndex];

    const updatedAlbum: Album = {
      ...album,
      ...dto,
    };
    this.storage[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  async removeAllConnectedTracks(albumId: string): Promise<void>{
    const allTracks = await this.trackService.findAll();
    const tracksToUpdate = allTracks.filter((track) => track.albumId === albumId);

    for(const track of tracksToUpdate){
      track.albumId = null;
      await this.trackService.updateTrack(track.id, track);
    }
  }

  async deleteAlbum(id: string): Promise<boolean> {
    const albumIndex = this.storage.findIndex(album => album.id === id);
    if (albumIndex === -1) {
      return false;
    }
    this.storage.splice(albumIndex, 1);
    this.removeAllConnectedTracks(id);
    return true;
  }
}

