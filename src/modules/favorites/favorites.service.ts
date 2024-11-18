import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly db: DatabaseService) {}

  async findAll() {
    const favorites = await this.db.favorites.findUnique({
      where: { id: 1 },
    });

    if (!favorites) {
      return { artists: [], albums: [], tracks: [] };
    }

    const artists = await this.db.artist.findMany({
      where: { id: { in: favorites.artists } },
    });
    const albums = await this.db.album.findMany({
      where: { id: { in: favorites.albums } },
    });
    const tracks = await this.db.track.findMany({
      where: { id: { in: favorites.tracks } },
    });
    return { artists, albums, tracks };
  }

  async addFavorite(type: 'artists' | 'albums' | 'tracks', id: string) {
    const favorites = await this.db.favorites.findUnique({ where: { id: 1 } });

    if (!favorites) {
      await this.db.favorites.create({
        data: {
          id: 1,
          artists: type === 'artists' ? [id] : [],
          albums: type === 'albums' ? [id] : [],
          tracks: type === 'tracks' ? [id] : [],
        },
      });
      return;
    }

    if (type === 'artists' && !favorites.artists.includes(id)) {
      await this.db.favorites.update({
        where: { id: 1 },
        data: { artists: [...favorites.artists, id] },
      });
    } else if (type === 'albums' && !favorites.albums.includes(id)) {
      await this.db.favorites.update({
        where: { id: 1 },
        data: { albums: [...favorites.albums, id] },
      });
    } else if (type === 'tracks' && !favorites.tracks.includes(id)) {
      await this.db.favorites.update({
        where: { id: 1 },
        data: { tracks: [...favorites.tracks, id] },
      });
    } else {
      throw new Error(`Invalid item type or item already exists - ${type}`);
    }
  }

  async removeFavorite(type: 'artists' | 'albums' | 'tracks', id: string) {
    const favorites = await this.db.favorites.findUnique({ where: { id: 1 } });

    if (!favorites || !favorites[type].includes(id)) {
      throw new NotFoundException(
        `${type} with id ${id} not found in : ${favorites[type]}`,
      );
    }

    await this.db.favorites.update({
      where: { id: 1 },
      data: {
        [type]: favorites[type].filter((itemId) => itemId !== id),
      },
    });
  }
}
