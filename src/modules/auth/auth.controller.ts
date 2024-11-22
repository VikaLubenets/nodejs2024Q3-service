import { Body, Controller, Post } from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { SigninService } from "./signin.service";
import { SignupService } from "./signup.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signinService: SigninService,
    private readonly signupService: SignupService,
) {}

  @Post('signup')
  signup(@Body() dto: SignupDto){
    return this.signupService.signup(dto)
  }

  @Post('login')
  login(@Body() dto: LoginDto){
    return this.signinService.login(dto)
  }

}