import { Injectable } from '@nestjs/common';
import { Artist } from './type';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto, UpdateArtistDto } from './dto';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Track } from '../track/type';
import { Album } from '../album/type';

@Injectable()
export class ArtistService {
  private storage: Artist[] = [];

  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

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

  async removeAllConnectedTracks(artistId: string): Promise<void> {
    const allTracks = await this.trackService.findAll();
    const tracksToUpdate = allTracks.filter((track) => track.artistId === artistId);
  
    for (const track of tracksToUpdate) {
      track.artistId = null;
      await this.trackService.updateTrack(track.id, track);
    }
  }
  
  async removeAllConnectedAlbums(artistId: string): Promise<void> {
    const allAlbums = await this.albumService.findAll();
    const albumsToUpdate = allAlbums.filter((album) => album.artistId === artistId);
  
    for (const album of albumsToUpdate) {
      album.artistId = null;
      await this.albumService.updateAlbum(album.id, album);
    }
  }

  async deleteArtist(id: string): Promise<boolean> {
    const artistIndex = this.storage.findIndex(artist => artist.id === id);
    if (artistIndex === -1) {
      return false;
    }
    this.storage.splice(artistIndex, 1);
    this.removeAllConnectedTracks(id);
    this.removeAllConnectedAlbums(id);
    return true;
  }
}
