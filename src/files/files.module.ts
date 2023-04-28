import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FilesEntity } from './entities/files.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [TypeOrmModule.forFeature([FilesEntity])],
})
export class FilesModule {}
