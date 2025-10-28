import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './book.entity';
// 1. IMPORT the other modules
import { AuthorsModule } from '../authors/authors.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  // 2. ADD AuthorsModule and CategoriesModule here
  imports: [
    TypeOrmModule.forFeature([Book]), // This module only needs the Book repository
    AuthorsModule, // This gives us access to AuthorRepository
    CategoriesModule, // This gives us access to CategoryRepository
  ],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}