import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAlbumDto {
  @ApiPropertyOptional({
    description: 'The name of the album, if updating',
    type: String,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'The year the album was released, if updating',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  year: number;

  @ApiPropertyOptional({
    description: 'The ID of the artist, if updating',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  artistId: string | null;
}
