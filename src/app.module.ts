import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsEntity } from './cats/entities/cats.entity';
import { AuthModule } from './auth/auth.module';
import 'dotenv/config';
import { AuthEntity } from './auth/entities/auth.entitty';
import { RequestLoggerMiddleware } from './middleware/logger.middlewars';
import { FilesModule } from './files/files.module';
import { FilesEntity } from './files/entities/files.entity';

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
      entities: [CatsEntity, AuthEntity, FilesEntity],
      synchronize: false,
    }),
    AuthModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
