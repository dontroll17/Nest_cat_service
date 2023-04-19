import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
    constructor(private service: CatsService) {}

    @Get()
    async getAllCats() {
        return this.service.getAllCats();
    }

    @Post()
    async addCat(
        @Body() dto: CreateCatDto
    ) {
        return this.service.createCat(dto);
    }

    @Delete(':id')
    async removeCat() {

    }

    @Put(':id') 
    async changeCat() {

    }
}
