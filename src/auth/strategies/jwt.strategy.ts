import { PassportStrategy } from "@nestjs/passport";
import { Passport } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
        private readonly config: ConfigService
    ){
        super({
            secretOrKey: config.get("JWT_SECRET") as string,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    } 

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload
        const user = await this.repository.findOneBy({id})

        if (!user)
            throw new UnauthorizedException('Token not valid')

        if (!user.isActive)
            throw new UnauthorizedException('User inactive')

        return user
    }

}