import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { DatabaseService } from '../database/database.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SignupService  {
  constructor(private readonly db: DatabaseService) {}

  async signup(dto: SignupDto){
    const { password, login } = dto;

    const hashPassword = await bcrypt.hash(password, 10);

    try {
      await this.db.user.create({
        data: {
          login,
          password: hashPassword,
        },
      });
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
  
}
