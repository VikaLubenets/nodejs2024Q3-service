import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const { password, login } = dto;

    const hashPassword = await bcrypt.hash(password, 10);

    try {
      await this.db.user.create({
        data: {
          login,
          password: hashPassword,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new HttpException(
            'User with this login has already been created',
            HttpStatus.CONFLICT,
          );
        }
      } else {
        console.error(err);
      }
    }
  }

  async login({ login, password }: LoginDto): Promise<{ token: string }> {
    const user = await this.db.user.findUnique({
      where: { login },
    });

    if (!user) {
      throw new HttpException(
        'Incorrect login or password',
        HttpStatus.FORBIDDEN,
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Incorrect login or password',
        HttpStatus.FORBIDDEN,
      );
    }

    const payload = { userId: user.id, login: user.login };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
