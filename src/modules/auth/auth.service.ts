import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/database.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class AuthService  {
  constructor(private readonly db: DatabaseService) {}

  async signup(dto: SignupDto){
    try {
        const user = await this.db.user.create({
            data: dto
        })
        return user;
    } catch(err){
        if(err instanceof PrismaClientKnownRequestError){
            if(err.code === 'P2002'){
                throw new HttpException('User with this login has already been created', HttpStatus.CONFLICT);
            }
        } else {
            console.error(err)
        }
    }
    
  }

  async login({login, password}: LoginDto){
    const user = await this.db.user.findUnique({
        where: { login, password },
      });
  
      if (!user) {
        throw new HttpException(
          'Incorrect login or password',
          HttpStatus.FORBIDDEN
        );
      }

      return 'token'
  }
  
}
