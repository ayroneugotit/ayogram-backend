import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UserUpdateDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public readonly email?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Length(8)
    public readonly password?: string;
}
