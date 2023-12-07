import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body(ValidationPipe) registerUserDto: RegisterUserDto) {
    return this.authService.userSignUp(registerUserDto);
  }

  @Post('login')
  loginUser(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.userSignIn(loginDto);
  }
}
