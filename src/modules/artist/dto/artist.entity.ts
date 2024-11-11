import { ApiProperty } from '@nestjs/swagger';

export class ArtistEntity {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'id UUID v4)',
  })
  id: string;

  @ApiProperty({
    example: 'Artist Name',
    description: 'The name of the artist',
  })
  name: string;

  @ApiProperty({
    example: true,
    description: 'Shows if the artist won a Grammy',
  })
  grammy: boolean;
}
