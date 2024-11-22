import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class SigninService  {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService
) {}

  async login({login, password}: LoginDto): Promise<{ token: string }>{
      const user = await this.db.user.findUnique({
        where: { login },
      });

      if (!user) {
        throw new HttpException(
          'Incorrect login or password',
          HttpStatus.FORBIDDEN
        );
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        throw new HttpException(
          'Incorrect login or password',
          HttpStatus.FORBIDDEN
        );
      }

      const payload = { userId: user.id, login: user.login };

      return {
        token: await this.jwtService.signAsync(payload),
      };
  }
  
}
