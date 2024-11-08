import { Body, Controller, Get, Post, Put, Param, Delete, HttpException, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto, User } from './type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): User {
    const user = this.userService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  createUser(@Body() dto: CreateUserDto): User {
    if (!dto.login || !dto.password) {
      throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
    }
    return this.userService.createUser(dto);
  }

  @Put(':id')
  updateUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdatePasswordDto,
  ): User {
    const updatedUser = this.userService.updateUser(id, dto);
    if (!updatedUser) {
      throw new HttpException('User not found or password mismatch', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  @Delete(':id')
  deleteUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): void {
    const result = this.userService.deleteUser(id);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}