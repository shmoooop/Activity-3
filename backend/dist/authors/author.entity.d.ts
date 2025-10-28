import { Book } from '../books/book.entity';
export declare class Author {
    id: number;
    name: string;
    bio?: string;
    books: Book[];
}
