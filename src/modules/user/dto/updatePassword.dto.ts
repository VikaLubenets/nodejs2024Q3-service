import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'oldpassword',
    description: 'The current password of the user',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: 'newpassword',
    description: 'The new password for the user',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}