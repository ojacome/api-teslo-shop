import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const RawHeaders = createParamDecorator( (data, ctx : ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    
    console.info(req.rawHeaders)

    return req.rawHeaders
})