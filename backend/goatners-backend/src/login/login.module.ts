import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret:'Mykey123',
      signOptions: {'expiresIn':'5h'}
    })
  ],
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule {}
