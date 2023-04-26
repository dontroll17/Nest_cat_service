import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsEntity } from './entities/cats.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  imports: [TypeOrmModule.forFeature([CatsEntity]), CacheModule.register()],
})
export class CatsModule {}
