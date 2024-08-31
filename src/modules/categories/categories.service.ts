import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schema/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }

  //add cate
  async create(createCategoryDto: CreateCategoryDto, userId: Types.ObjectId): Promise<Category> {

    const categoryWithUserId = {
      ...createCategoryDto,
      userId
    };

    const createdCategory = new this.categoryModel(categoryWithUserId);
    return createdCategory.save();
  }


  async findAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  }

  async findAll(query: string, current: number, pageSize: number, userId: Types.ObjectId) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    // Lọc theo userId
    filter['userId'] = userId;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.categoryModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const results = await this.categoryModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      results //kết quả query
    }
  }

  async findOne(id: Types.ObjectId, userId: Types.ObjectId): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id: id, userId }).exec();
    if (!category) {
      throw new NotFoundException('Category not found or you do not have access to it');
    }
    return category;
  }

  async update(updateCategoryDto: UpdateCategoryDto, ) {

    return await this.categoryModel.updateOne(
      { _id: updateCategoryDto._id }, { ...updateCategoryDto }
    );
  }
  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.categoryModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("Id không đúng định dạng mongodb")
    }
  }
}
