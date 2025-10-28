import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { Author } from './authors/author.entity';
import { Book } from './books/book.entity';
import { Category } from './categories/category.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // --- CHANGE THIS BACK ---
      database: 'digital_bookshelf.sqlite', // Put the DB back in the root folder
      entities: [Author, Book, Category],
      synchronize: true,
    }),
    AuthorsModule,
    BooksModule,
    CategoriesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}