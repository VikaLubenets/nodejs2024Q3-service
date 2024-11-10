import { Injectable, NotFoundException } from '@nestjs/common';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavoritesService {
  private favorites: {
    artists: string[];
    albums: string[];
    tracks: string[];
  } = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  async findAll() {
    const artists = await Promise.all(
      this.favorites.artists.map(id => this.artistService.findOne(id))
    );
    const albums = await Promise.all(
      this.favorites.albums.map(id => this.albumService.findOne(id))
    );
    const tracks = await Promise.all(
      this.favorites.tracks.map(id => this.trackService.findOne(id))
    );

    return {
      artists,
      albums,
      tracks,
    };
  }

  addFavorite(type: 'artists' | 'albums' | 'tracks', id: string) {
    if (type === 'artists' && !this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    } else if (type === 'albums' && !this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    } else if (type === 'tracks' && !this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    } else {
      throw new Error(`Invalid item type - ${type}`);
    }
  }

  removeFavorite(type: 'artists' | 'albums' | 'tracks', id: string) {
    const index = this.favorites[type].indexOf(id);
    if (index === -1) throw new NotFoundException(`${type} with id ${id} not found in favorites`);
    this.favorites[type].splice(index, 1);
  }

  isFavorite(type: 'artists' | 'albums' | 'tracks', id: string): boolean {
    return this.favorites[type].includes(id);
  }
}
