import { IsNotEmpty, Length } from 'class-validator';

export class CreatePostDto {
  @Length(5, 255, { message: 'Заголовок минимум 5-ть символов.' })
  title: string;

  @IsNotEmpty({ message: 'Напишите хоть часть статьи.' })
  text: string;
}
