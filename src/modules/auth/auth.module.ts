import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
