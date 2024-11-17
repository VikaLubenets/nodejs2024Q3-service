import { Injectable } from '@nestjs/common';
import { Album } from './type';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { TrackService } from '../track/track.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlbumService {
  constructor(private readonly db: DatabaseService, private readonly trackService: TrackService) {}

  async findAll(): Promise<Album[]> {
    return this.db.album.findMany();
  }

  async findOne(id: string): Promise<Album | null> {
    return this.db.album.findUnique({ where: { id } });
  }

  async createAlbum(dto: CreateAlbumDto): Promise<Album> {
    return this.db.album.create({ data: dto });
  }

  async updateAlbum(id: string, dto: UpdateAlbumDto): Promise<Album | null> {
    const album = await this.db.album.findUnique({ where: { id } });

    if (!album) {
      return null;
    }

    return this.db.album.update({
      where: { id },
      data: dto,
    });
  }

  async removeAllConnectedTracks(albumId: string): Promise<void> {
    const tracks = await this.trackService.findAll();
    const tracksToUpdate = tracks.filter((track) => track.albumId === albumId);

    for (const track of tracksToUpdate) {
      track.albumId = null;
      await this.trackService.updateTrack(track.id, track);
    }
  }

  async deleteAlbum(id: string): Promise<boolean> {
    const album = await this.db.album.findUnique({ where: { id } });
    if (!album) {
      return false;
    }

    await this.removeAllConnectedTracks(id);
    await this.db.album.delete({ where: { id } });
    return true;
  }
}
