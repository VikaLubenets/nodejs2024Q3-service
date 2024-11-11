import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({
    description: 'The name of the artist',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Whether the artist has won a Grammy',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
