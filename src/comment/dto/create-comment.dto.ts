import { IsNotEmpty } from 'class-validator';
import { lang } from 'src/utils/lang/lang';

export class CreateCommentDto {
  @IsNotEmpty({ message: lang.ru.required })
  text: string;

  @IsNotEmpty({ message: lang.ru.required })
  postId: number;
}
