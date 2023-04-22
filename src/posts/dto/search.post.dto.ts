export class SearchPostDto {
  title?: string;
  text?: string;
  limit?: number;
  take?: number;
  views?: 'DESC' | 'ASC';
}
