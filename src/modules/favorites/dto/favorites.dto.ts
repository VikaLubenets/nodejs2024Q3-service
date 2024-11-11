import { ApiProperty } from '@nestjs/swagger';
import { AlbumEntity } from 'src/modules/album/dto/album.entity';
import { Album } from 'src/modules/album/type';
import { ArtistEntity } from 'src/modules/artist/dto/artist.entity';
import { Artist } from 'src/modules/artist/type';
import { TrackEntity } from 'src/modules/track/dto/track.entity';
import { Track } from 'src/modules/track/type';

export class FavoritesDto {
  @ApiProperty({
    description: 'Favorites artists',
    type: [ArtistEntity],
  })
  artists: Artist[];

  @ApiProperty({
    description: 'Favorites albums',
    type: [AlbumEntity],
  })
  albums: Album[];

  @ApiProperty({
    description: 'Favorites tracks',
    type: [TrackEntity],
  })
  tracks: Track[];
}
