import { Query, Controller, Get, Post, Body, Patch, Param, Delete, Put, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public, Roles } from '@/decorator/customize';
import { Category } from './schema/category.schema';
import { Types } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { Request } from 'express';
import { RolesGuard } from '@/auth/passport/roles.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get('all')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async findAllCategories(@Req() req: Request): Promise<Category[]> {
    const user = req.user as UserDocument;
    return this.categoriesService.findAllCategories();
  }

  @Get()
  findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Req() req: Request
  ) {
    const user = req.user as UserDocument;
    const userId = user._id;
    return this.categoriesService.findAll(query, +current, +pageSize, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request): Promise<Category> {
    const user = req.user as UserDocument;
    const userId = user._id;
    const categoryId = new Types.ObjectId(id);
    const category = await this.categoriesService.findOne(categoryId, userId);
    if (!category) {
      throw new NotFoundException('Category not found or you do not have access to it');
    }
    return category;
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    const user = req.user as UserDocument;
    const userId = user._id;
    return this.categoriesService.create(createCategoryDto, userId);
  }


  @Put()
  async update(@Body() updateCategoryDto: UpdateCategoryDto, @Req() req: Request
  ) {
    const user = req.user as UserDocument;
    const userId = user._id;
    return this.categoriesService.update(updateCategoryDto, userId);
  }
  @Delete(':id') remove(@Param('id') id: string, @Req() req: Request
  ) {
    const user = req.user as UserDocument;
    const userId = user._id;
    return this.categoriesService.remove(id, userId);
  }

  @Post('hide/:id') // Endpoint to hide a category
  async toggleCategoryVisibility(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as UserDocument;
    const userId = user._id;
    const categoryId = new Types.ObjectId(id);
    return this.categoriesService.toggleCategoryVisibility(categoryId, userId);
  }
}
