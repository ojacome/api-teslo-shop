import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginatioDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name)

  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>
  ) { }


  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.repository.create(createProductDto)
      await this.repository.save(product)

      return product
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(pagination : PaginatioDto) {
    const { limit = 10, offset = 0 } = pagination
    return await this.repository.find({
      take: limit,
      skip: offset
    })
  }

  async findOne(id: string) {
    const product = await this.repository.findOneBy({ id })
    if (!product) throw new NotFoundException(`Product not found with ${id}`)

    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const productDB = await this.findOne(id)

    return await this.repository.remove(productDB)
  }

  private handleExceptions(error: any) {
    if (error.code === "23505")
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException("error al crear proucto")
  }
}
