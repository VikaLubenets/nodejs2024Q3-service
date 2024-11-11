import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrackDto {
  @ApiPropertyOptional({
    description: 'The name of the track, if updating',
    type: String,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'The ID of the artist, if updating',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  artistId: string | null;

  @ApiPropertyOptional({
    description: 'The ID of the album, if updating',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  albumId: string | null;

  @ApiPropertyOptional({
    description: 'The duration of the track in seconds, if updating',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  duration: number;
}
