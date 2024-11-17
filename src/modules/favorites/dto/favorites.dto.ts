import { Album } from 'src/modules/album/type';
import { Artist } from 'src/modules/artist/type';
import { Track } from 'src/modules/track/type';

export class FavoritesDto {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
