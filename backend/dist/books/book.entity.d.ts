import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';
export declare class Book {
    id: number;
    title: string;
    description?: string;
    year?: number;
    author: Author;
    category: Category;
}
