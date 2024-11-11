import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TrackModule } from './modules/track/track.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ArtistModule } from './modules/artist/artist.module';
import { AlbumModule } from './modules/album/album.module';

@Module({
  imports: [
    UserModule,
    TrackModule,
    FavoritesModule,
    ArtistModule,
    AlbumModule,
  ],
})
export class AppModule {}
