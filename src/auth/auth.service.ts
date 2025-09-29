import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async register(createAuthDto: CreateUserDto) {
    try {
      const user = this.repository.create(createAuthDto)

      await this.repository.save(user)
      
      return user
    } catch (error) {
      this.handleErrorsDB(error)
    }
  }

  private handleErrorsDB(err: any) {
    if(err.code === '23505') 
      throw new BadRequestException(err.detail)

    console.error(err.detail)

    throw new InternalServerErrorException("Error al crear usuario")
  }
}
