declare class BookRelationDto {
    name: string;
}
export declare class CreateBookDto {
    title: string;
    description?: string;
    year?: number;
    author?: BookRelationDto;
    category?: BookRelationDto;
}
export {};
