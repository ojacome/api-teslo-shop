import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  
  constructor( 
    @InjectRepository(Product)
    private readonly repository: Repository<Product>
  ) {}


  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.repository.create(createProductDto)
      await this.repository.save(product)

      return product
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("error al crear proucto")
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
