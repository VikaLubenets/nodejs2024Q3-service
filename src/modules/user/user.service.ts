import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './type';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto, UpdatePasswordDto } from './dto';

@Injectable()
export class UserService {
  private storage: User[] = [];

  async findAll(): Promise<User[]> {
    return this.storage;
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.storage.find((user) => user.id === id);
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const newUser: User = {
      ...dto,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };
    this.storage.push(newUser);
    return newUser;
  }

  async updateUser(id: string, dto: UpdatePasswordDto): Promise<User | null> {
    const userIndex = this.storage.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    const user = this.storage[userIndex];

    if (user.password !== dto.oldPassword) {
      throw new HttpException('Incorrect old password', HttpStatus.FORBIDDEN);
    }

    const updatedUser: User = {
      ...user,
      password: dto.newPassword,
      updatedAt: Date.now(),
      version: user.version + 1,
    };
    this.storage[userIndex] = updatedUser;
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.storage.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return false;
    }
    this.storage.splice(userIndex, 1);
    return true;
  }
}
