import { ApiProperty } from '@nestjs/swagger';

export class TrackEntity {
  @ApiProperty({
    example: '9fda4bc0-fcb5-4e8b-bc73-5e00a6de59c3',
    description: 'id UUID v4)',
  })
  id: string;

  @ApiProperty({
    example: 'Track Title',
    description: 'The name of the track',
  })
  name: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the artist associated with the track, if any',
    nullable: true,
  })
  artistId: string | null;

  @ApiProperty({
    example: 'abcdef12-3456-7890-abcd-ef1234567890',
    description: 'The ID of the album associated with the track, if any',
    nullable: true,
  })
  albumId: string | null;

  @ApiProperty({
    example: 60,
    description: 'The duration of the track in seconds',
  })
  duration: number;
}
