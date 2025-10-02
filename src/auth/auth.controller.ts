import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(
    @Body() createAuthDto: CreateUserDto
  ) {
    return this.authService.register(createAuthDto);
  }
  
  @Post("login")
  login(
    @Body() createAuthDto: LoginUserDto
  ) {
    return this.authService.login(createAuthDto);
  }
  
  @Post("test")
  @UseGuards(AuthGuard())
  test(
  ) {
    return {
      ok: "true"
    }
  }
}
