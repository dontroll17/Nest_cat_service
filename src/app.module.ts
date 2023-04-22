import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsEntity } from './cats/entities/cats.entity';
import 'dotenv/config';

@Module({
  imports: [
    CatsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      entities: [CatsEntity],
      synchronize: false,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
