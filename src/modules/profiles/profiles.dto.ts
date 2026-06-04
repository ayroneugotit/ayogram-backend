import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class ProfileUpdateDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Length(3)
    public readonly username?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public readonly bio?: string;
}
