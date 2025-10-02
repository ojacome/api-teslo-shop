import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async register(createAuthDto: CreateUserDto) {
    try {
      const { password, ...userData } = createAuthDto
      const user = this.repository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this.repository.save(user)

      const { password: pass, ...userInfo } = user;

      return {
        ...userInfo,
        token: this.getJwtToken({ id: userInfo.id })
      }
    } catch (error) {
      this.handleErrorsDB(error)
    }
  }

  async login(request: LoginUserDto) {
    const { email, password } = request

    const userDB = await this.repository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    })

    if (!userDB)
      throw new UnauthorizedException("User not found")

    if (!bcrypt.compareSync(password, userDB.password))
      throw new UnauthorizedException("Credentials invalid")

    return {
      ...userDB,
      token: this.getJwtToken({ id: userDB.id })
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token
  }

  private handleErrorsDB(err: any) {
    if (err.code === '23505')
      throw new BadRequestException(err.detail)

    console.error(err.detail)

    throw new InternalServerErrorException("Error al crear usuario")
  }
}
