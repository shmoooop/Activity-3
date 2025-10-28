import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
  ) {}

  create(dto: CreateCategoryDto) {
    const category = this.categoriesRepo.create(dto);
    return this.categoriesRepo.save(category);
  }

  findAll() {
    return this.categoriesRepo.find();
  }

  findOne(id: number) {
    return this.categoriesRepo.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateCategoryDto>) {
    await this.categoriesRepo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.categoriesRepo.delete(id);
  }
}
