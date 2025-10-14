import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./";

@Entity()
export class Product {
    @ApiProperty({ description: "es unico tipo uuid"})
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty()
    @Column('text', { unique: true })
    title: string

    @ApiProperty()
    @Column('float', { default: 0 })
    price: number

    @ApiProperty()
    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @ApiProperty()
    @Column({
        type: 'text',
        unique: true
    })
    slug: string

    @ApiProperty()
    @Column({
        type: 'int',
        default: 0
    })
    stock: number

    @ApiProperty()
    @Column({
        type: 'text',
        array: true
    })
    sizes: string[]

    @ApiProperty()
    @Column({
        type: 'text'
    })
    gender: string
   
    @ApiProperty()
    @Column({
        type: 'text',
        default: [],
        array: true
    })
    tags: string[]

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade: true}
    )
    images?: ProductImage[]

    @BeforeInsert()
    checkSlugInsert() {
        if(!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'","")
    }
    
    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'","")
    }
}
