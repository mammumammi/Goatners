import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {

    constructor(@InjectRepository(User) private userRepo:Repository<User>,private jwtService:JwtService){}
    
    async  signup(username:string,password:string){
        const existingUser = await this.userRepo.findOne({where: {username}});
        if (existingUser){
            throw new UnauthorizedException('User already exists');
        }

        const hashed = await bcrypt.hash(password,10);
        const newUser = await this.userRepo.create({username:username,password:hashed});
        
        await this.userRepo.save(newUser);

        const payload = {username:newUser.username,sub:newUser.id};
        const token = this.jwtService.sign(payload);

        return { access_token:token,userId:newUser.id};
    }

    async login(username:string,password:string){
        const user = await this.userRepo.findOne({where:{username}});

        if  (!user){
            throw new UnauthorizedException("No user with the given credentials");
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch){
            throw new UnauthorizedException("Incorrect password please try again!");
        }

        const payload = {username:user.username,sub:user.id};
        const token = await this.jwtService.sign(payload);

        return {access_token:token};
    }
}
