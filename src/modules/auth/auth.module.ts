import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SigninService } from './signin.service';
import { SignupService } from './signup.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Global()
@Module({
  imports: [
      JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME },
      }),
  ],
  providers: [SigninService, SignupService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
