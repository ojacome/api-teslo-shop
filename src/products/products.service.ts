import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatioDto } from 'src/common/dto/pagination.dto';
import { validate as IsUuid } from 'uuid'
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name)

  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly repositoryImages: Repository<ProductImage>
  ) { }


  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto

      const product = this.repository.create({
        ...productDetails,
        images: images.map(image => this.repositoryImages.create({url: image}))
      })
      await this.repository.save(product)

      return { ...product, images }
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(pagination: PaginatioDto) {
    const { limit = 10, offset = 0 } = pagination
    return await this.repository.find({
      take: limit,
      skip: offset
    })
  }

  async findOne(term: string) {
    let product: Product | null = null

    if (IsUuid(term)) product = await this.repository.findOneBy({ id: term })
    else {
      const builder = this.repository.createQueryBuilder()
      product = await builder.where('UPPER(title) =:title or slug =:slug', {
        title: term.toLocaleUpperCase(),
        slug: term.toLocaleLowerCase()
      }).getOne()
    }

    if (!product) throw new NotFoundException(`Product not found with ${term}`)

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.repository.preload({
      id: id,
      ...updateProductDto,
      images: []
    })

    if (!product) throw new NotFoundException(`Product not found ${id}`)

    try {
      return await this.repository.save(product);
    } catch (error) {
      this.handleExceptions(error)
    }
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
