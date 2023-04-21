import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail(undefined, { message: 'Укажите правильно почту.' })
  email: string;

  @Length(3, 50, { message: 'Имя и фамилия от 3-х до 50-ти символов.' })
  fullName: string;

  @Length(6, 33, { message: 'Пароль должен быть от 6-ти до 33-х символов.' })
  password?: string;
}
