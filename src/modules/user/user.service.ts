import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { DatabaseService } from '../database/database.service';
import { transformUser } from 'src/utils/transfromUser';
import { PrismaUser as User, User as UserI } from './type';

@Injectable()
export class UserService {
  private storage: User[] = [];
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<User[]> {
    return this.db.user.findMany();
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.db.user.findUnique({ where: { id } });
  }

  async createUser(dto: CreateUserDto): Promise<UserI> {
    const user = await this.db.user.create({ data: { ...dto } });
    return transformUser(user);
  }

  async updateUser(id: string, dto: UpdatePasswordDto): Promise<UserI | null> {
    const user = await this.db.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    if (user.password !== dto.oldPassword) {
      throw new HttpException('Incorrect old password', HttpStatus.FORBIDDEN);
    }

    const updatedUser = {
      password: dto.newPassword,
      version: user.version + 1,
    };

    const userUPD = await this.db.user.update({
      where: { id },
      data: updatedUser,
    });

    return transformUser(userUPD);
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.db.user.findUnique({ where: { id } });

    if (!user) {
      return false;
    }

    await this.db.user.delete({ where: { id } });
    return true;
  }
}
