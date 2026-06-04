import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CommentCreateDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public readonly postId!: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public readonly body!: string;
}

export class CommentUpdateDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public readonly body!: string;
}
