import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty({
    description: 'The name of the album',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The year the album was released',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiPropertyOptional({
    description: 'The ID of the artist, if available',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  artistId: string | null;
}
