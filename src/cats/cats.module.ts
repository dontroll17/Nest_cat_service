import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsEntity } from './entities/cats.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { FilesEntity } from '../../src/files/entities/files.entity';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  imports: [
    TypeOrmModule.forFeature([CatsEntity, FilesEntity]),
    CacheModule.register(),
  ],
})
export class CatsModule {}
