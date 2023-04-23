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
  UseGuards,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { CatsEntity } from './entities/cats.entity';
import { ChangeCatDto } from './dto/change-cat.dto';
import { AuthGuard } from '@nestjs/passport';
import { CacheKey } from '@nestjs/cache-manager';

@Controller('cats')
export class CatsController {
  constructor(private service: CatsService) {}

  @CacheKey('cats')
  @Get()
  async getAllCats(): Promise<CatsEntity[]> {
    return this.service.getAllCats();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addCat(@Body() dto: CreateCatDto): Promise<CatsEntity> {
    return this.service.createCat(dto);
  }

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
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
