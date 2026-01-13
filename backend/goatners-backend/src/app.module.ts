import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule} from '@nestjs/config'

@Module({
  imports: [LoginModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: async () => ({
        type:'postgres',
        url:"postgresql://postgres.iuetzhswcllrpxorftsl:Goatners@136@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres",
        autoLoadEntities:true,
        synchronize:false,
        ssl:{
          rejectUnauthorized: false
        },
        logging:true
      }),

    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
