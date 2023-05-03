import { IsNotEmpty, Length } from 'class-validator';

export interface IOutputDataBlocks {
  id: string;
  type: 'paragraph' | null;
  data: {
    text: string;
  };
}

export class CreatePostDto {
  @Length(5, 255, { message: 'Заголовок минимум 5-ть символов.' })
  title: string;

  @IsNotEmpty({ message: 'Напишите содержимое статьи.' })
  text: IOutputDataBlocks[];

  description: IOutputDataBlocks;
}
