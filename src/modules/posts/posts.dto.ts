import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostCreateDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public readonly title!: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public readonly body!: string;
}

export class PostUpdateDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public readonly title?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public readonly body?: string;
}
