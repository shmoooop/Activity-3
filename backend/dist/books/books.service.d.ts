import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';
export declare class BooksService {
    private booksRepo;
    private authorsRepo;
    private categoriesRepo;
    constructor(booksRepo: Repository<Book>, authorsRepo: Repository<Author>, categoriesRepo: Repository<Category>);
    seedSample(): Promise<{
        createdCount: number;
        books: any[];
    }>;
    create(dto: CreateBookDto): Promise<Book>;
    findAll(searchQuery?: string): Promise<Book[]>;
    findOne(id: number): Promise<Book>;
    update(id: number, dto: UpdateBookDto): Promise<Book>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
