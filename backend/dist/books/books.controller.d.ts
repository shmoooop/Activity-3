import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BooksService } from './books.service';
export declare class BooksController {
    private booksService;
    constructor(booksService: BooksService);
    seedSample(): Promise<{
        createdCount: number;
        books: any[];
    }>;
    create(dto: CreateBookDto): Promise<import("./book.entity").Book>;
    findAll(searchQuery?: string): Promise<import("./book.entity").Book[]>;
    findOne(id: string): Promise<import("./book.entity").Book>;
    update(id: string, dto: UpdateBookDto): Promise<import("./book.entity").Book>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
