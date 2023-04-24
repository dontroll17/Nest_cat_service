import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { CatsEntity } from './entities/cats.entity';
import { ChangeCatDto } from './dto/change-cat.dto';
import { AuthGuard } from '@nestjs/passport';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('cats')
export class CatsController {
  constructor(
    private service: CatsService
  ) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('cats')
  @CacheTTL(30)
  @Get()
  async getAllCats(): Promise<CatsEntity[]> {
    return this.service.getAllCats();
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['Admin', 'User'])
  @Post()
  async addCat(@Body() dto: CreateCatDto): Promise<CatsEntity> {
    return this.service.createCat(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['Admin'])
  @Delete(':id')
  @HttpCode(204)
  async removeCat(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
  ): Promise<void> {
    return await this.service.removeCat(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['Admin'])
  @Put(':id')
  async changeCat(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
    @Body() dto: ChangeCatDto,
  ): Promise<CatsEntity> {
    return await this.service.changeCat(id, dto);
  }
}
