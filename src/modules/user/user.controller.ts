import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './type';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from './dto/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All users.' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'User', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'User id is not valid' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException(
        "Record with the provided id doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User is created', type: UserEntity })
  @ApiResponse({ status: 400, description: 'Request body does not contain required fields' })
  async createUser(
    @Body() dto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const { password, ...createdUserWithoutPassword } =
      await this.userService.createUser(dto);
    return createdUserWithoutPassword;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, description: 'Password is updated', type: UserEntity })
  @ApiResponse({ status: 400, description: 'Request body does not contain required fields' })
  @ApiResponse({ status: 404, description: "Record with id === userId doesn't exist" })
  @ApiResponse({ status: 403, description: 'oldPassword is wrong' })
  async updateUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    const updatedUser = await this.userService.updateUser(id, dto);
    if (!updatedUser) {
      throw new HttpException(
        "Record with the provided id doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    const { password, ...updatedUserWithoutPassword } = updatedUser;
    return updatedUserWithoutPassword;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204, description: 'User is deleted', type: UserEntity })
  @ApiResponse({ status: 400, description: 'userId is invalid' })
  @ApiResponse({ status: 404, description: "Record with id === userId doesn't exist" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    const result = await this.userService.deleteUser(id);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
