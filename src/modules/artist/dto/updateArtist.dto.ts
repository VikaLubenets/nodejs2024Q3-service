import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArtistDto {
  @ApiPropertyOptional({
    description: 'The name of the artist, if updating',
    type: String,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Whether the artist has won a Grammy, if updating',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  grammy: boolean;
}
