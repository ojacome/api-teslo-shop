import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';

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
    @GetUser() user: User,
    @GetUser('email') userEmail: User,
    @RawHeaders() rawHeaders: any
  ) {
    console.info(rawHeaders)
    return {
      ok: "true",
      user,
      userEmail
    }
  }
  
  @Post("test2")
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  test2(
    @GetUser() user: User,
  ) {
    return {
      ok: "true",
      user
    }
  }
}
