import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user',
    description: 'The login of the new user',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    example: 'password',
    description: 'The password for the new user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
