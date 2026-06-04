import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class LikeCreateDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public readonly postId!: string;
}

export class LikeDeleteDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public readonly postId!: string;
}
