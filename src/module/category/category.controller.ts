import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception-filters/exception-filter';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CreateCategoryDto } from './dto/req.dto';

@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@ApiTags('[CATEGORY]')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategory() {
    return this.categoryService.getCategory();
  }

  @Post()
  createCategory(@Body() body: CreateCategoryDto) {
    return this.categoryService.createCategory(body);
  }

  @Delete(':categoryId')
  deleteCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoryService.deleteCategory(categoryId);
  }
}
