import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SigninService } from './signin.service';
import { SignupService } from './signup.service';

@Global()
@Module({
  imports: [],
  providers: [SigninService, SignupService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
