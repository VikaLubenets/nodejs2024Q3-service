import { Injectable } from '@nestjs/common';
import { Artist } from './type';
import { CreateArtistDto, UpdateArtistDto } from './dto';
import { DatabaseService } from '../database/database.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly db: DatabaseService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.db.artist.findMany();
  }

  async findOne(id: string): Promise<Artist | null> {
    return this.db.artist.findUnique({ where: { id } });
  }

  async createArtist(dto: CreateArtistDto): Promise<Artist> {
    return this.db.artist.create({ data: dto });
  }

  async updateArtist(id: string, dto: UpdateArtistDto): Promise<Artist | null> {
    const artist = await this.db.artist.findUnique({ where: { id } });

    if (!artist) {
      return null;
    }

    return this.db.artist.update({
      where: { id },
      data: dto,
    });
  }

  async removeAllConnectedTracks(artistId: string): Promise<void> {
    const tracks = await this.trackService.findAll();
    const tracksToUpdate = tracks.filter((track) => track.artistId === artistId);

    for (const track of tracksToUpdate) {
      track.artistId = null;
      await this.trackService.updateTrack(track.id, track);
    }
  }

  async removeAllConnectedAlbums(artistId: string): Promise<void> {
    const albums = await this.albumService.findAll();
    const albumsToUpdate = albums.filter((album) => album.artistId === artistId);

    for (const album of albumsToUpdate) {
      album.artistId = null;
      await this.albumService.updateAlbum(album.id, album);
    }
  }

  async deleteArtist(id: string): Promise<boolean> {
    const artist = await this.db.artist.findUnique({ where: { id } });
    if (!artist) {
      return false;
    }

    await this.removeAllConnectedTracks(id);
    await this.removeAllConnectedAlbums(id);

    await this.db.artist.delete({ where: { id } });
    return true;
  }
}
