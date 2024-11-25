import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signup(dto: SignupDto) {
    const { password, login } = dto;

    const hashPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userService.createUser({ login, password: hashPassword });
      return user
    } catch (err) {
        if (err.code === 'P2002') {
          throw new HttpException(
            'User with this login has already been created',
            HttpStatus.CONFLICT,
          );
      } else {
        console.error(err);
      }
    }
  }

  async login({ login, password }: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findByLogin(login);

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
    const token = await this.jwtService.signAsync(payload);

    return { accessToken: token };
  }

}
