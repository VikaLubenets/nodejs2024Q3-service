import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto, User } from './type';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private storage: User[] = [];

  findAll(): User[] {
    return this.storage;
  }

  findOne(id: string): User | undefined {
    return this.storage.find(user => user.id === id);
  }

  createUser(dto: CreateUserDto): User {
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

  updateUser(id: string, dto: UpdatePasswordDto): User | null {
    const userIndex = this.storage.findIndex(user => user.id === id);
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

  deleteUser(id: string): boolean {
    const userIndex = this.storage.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }
    this.storage.splice(userIndex, 1);
    return true;
  }
}