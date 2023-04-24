import { IsEmail, Length } from 'class-validator';
import { lang } from 'src/utils/lang/lang';

export class CreateUserDto {
  @IsEmail(undefined, { message: lang.ru.isEmail })
  email: string;

  @Length(3, 50, { message: 'Имя и фамилия от 3-х до 50-ти символов.' })
  fullName: string;

  @Length(6, 33, { message: 'Пароль должен быть от 6-ти до 33-х символов.' })
  password?: string;
}
