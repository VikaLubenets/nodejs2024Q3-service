import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'The unique identifier for the User (UUID v4)',
  })
  id: string;

  @ApiProperty({
    example: 'user',
    description: 'The login of the User',
  })
  login: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the User',
  })
  password: string;

  @ApiProperty({
    example: 1,
    description: 'The version number of the User entity, increments on update',
  })
  version: number;

  @ApiProperty({
    example: 1627811223456,
    description: 'Timestamp of User creation',
  })
  createdAt: number;

  @ApiProperty({
    example: 1627811223456,
    description: 'Timestamp of the last User update',
  })
  updatedAt: number;
}
