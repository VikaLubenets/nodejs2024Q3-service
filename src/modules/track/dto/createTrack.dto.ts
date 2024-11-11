import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty({
    description: 'The name of the track',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'The ID of the artist, if available',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  artistId: string | null;

  @ApiPropertyOptional({
    description: 'The ID of the album, if available',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  albumId: string | null;

  @ApiProperty({
    description: 'The duration of the track in seconds',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
