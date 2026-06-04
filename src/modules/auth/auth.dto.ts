import { IsDefined, IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthRegisterDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public readonly email!: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Length(3)
    public readonly username!: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Length(8)
    public readonly password!: string;
}

export class AuthLoginDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public readonly login!: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public readonly password!: string;
}
