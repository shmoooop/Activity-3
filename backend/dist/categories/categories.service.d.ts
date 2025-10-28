import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './category.entity';
export declare class CategoriesService {
    private categoriesRepo;
    constructor(categoriesRepo: Repository<Category>);
    create(dto: CreateCategoryDto): Promise<Category>;
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    update(id: number, dto: Partial<CreateCategoryDto>): Promise<Category>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
