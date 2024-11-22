import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SigninService  {
  constructor(private readonly db: DatabaseService) {}

  async login({login, password}: LoginDto){
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

      return 'token'
  }
  
}
