import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsOptional, IsPositive } from "class-validator"

export class PaginatioDto {

    //docs init
    @ApiProperty({ default: 10, description: "cantidad por pagina"})
    //docs end
    @IsOptional()
    @IsPositive()
    @Type( () => Number)
    limit?: number

    //docs init
    @ApiProperty({ description: "cantidad que se va saltando para el paginado"})
    //docs end
    @IsOptional()
    @Type( () => Number)
    offset?: number

}