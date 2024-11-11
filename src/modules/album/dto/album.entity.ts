import { ApiProperty } from '@nestjs/swagger';

export class AlbumEntity {
  @ApiProperty({
    example: 'abcdef12-3456-7890-abcd-ef1234567890',
    description: 'id UUID v4)',
  })
  id: string;

  @ApiProperty({
    example: 'Album Title',
    description: 'The name of the album',
  })
  name: string;

  @ApiProperty({
    example: 2022,
    description: 'The year of the album',
  })
  year: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the artist associated with the album',
    nullable: true,
  })
  artistId: string | null;
}
