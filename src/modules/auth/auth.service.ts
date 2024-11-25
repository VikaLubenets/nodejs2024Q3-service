import { HttpException, HttpStatus, Injectable, ForbiddenException } from '@nestjs/common';
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
      const user = await this.userService.createUser({
        login,
        password: hashPassword,
      });
      return user;
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

  async login({ login, password }: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
    try{
      const user = await this.userService.findByLogin(login);

      if (!user) {
        throw new ForbiddenException('Incorrect login or password');
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
      if (!isPasswordCorrect) {
        throw new ForbiddenException('Incorrect login or password');
      }
  
      const payload = { userId: user.id, login: user.login };
      const token = await this.jwtService.signAsync(payload);
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      });
  
      return { accessToken: token, refreshToken };
    } catch(err){
      console.error(err);
    }
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const oldPayload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
  
      const newPayload = { userId: oldPayload.userId, login: oldPayload.login };
  
      const accessToken = await this.jwtService.signAsync(newPayload, {
        secret: process.env.JWT_SECRET_ACCESS_KEY,
        expiresIn: process.env.TOKEN_ACCESS_EXPIRE_TIME,
      });
  
      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      });
  
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error(error);
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }
}
