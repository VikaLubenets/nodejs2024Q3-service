import { Body, Controller, Get, Post, Put, Param, Delete, HttpException, HttpStatus, ParseUUIDPipe, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './type';
import { CreateUserDto, UpdatePasswordDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException("Record with the provided id doesn't exist", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }

  @Put(':id')
  async updateUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdatePasswordDto,
  ): Promise<User> {
    const updatedUser = await this.userService.updateUser(id, dto);
    if (!updatedUser) {
      throw new HttpException("Record with the provided id doesn't exist", HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> { 
    const result = await this.userService.deleteUser(id);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
