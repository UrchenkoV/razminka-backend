import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { SearchPostDto } from './dto/search.post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity) private repository: Repository<PostEntity>,
  ) {}

  create(dto: CreatePostDto, userId: number) {
    const firstParagraph =
      dto.text.find((item) => item.type === 'paragraph')?.data.text || '';

    return this.repository.save({
      title: dto.title,
      text: dto.text,
      description: firstParagraph,
      user: { id: userId },
    });
  }

  async update(id: number, dto: UpdatePostDto) {
    await this.byId(id);

    const firstParagraph =
      dto.text.find((item) => item.type === 'paragraph')?.data.text || '';

    return this.repository.update(id, {
      title: dto.title,
      text: dto.text,
      description: firstParagraph,
    });
  }

  findAll() {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: {
        user: true,
      },
    });
  }

  async popular() {
    const qb = await this.repository
      .createQueryBuilder('p')
      .orderBy('views', 'DESC')
      .limit(10)
      .getManyAndCount();

    const [items, totalCount] = qb;

    return { items, totalCount };
  }

  async search(dto: SearchPostDto) {
    const qb = this.repository.createQueryBuilder('p');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.views) {
      qb.orderBy('views', dto.views);
    }

    if (dto.text) {
      qb.where(`p.text ILIKE :text`, { text: `%${dto.text}%` });
    }

    if (dto.title) {
      qb.orWhere(`p.title ILIKE :title`, { title: `%${dto.title}%` });
    }

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  async byId(id: number, query?: { comments: number }) {
    console.log(query, '777');
    const qb = this.repository.createQueryBuilder('post');
    qb.where('post.id = :id', { id: id });
    qb.leftJoinAndSelect('post.user', 'user');

    if (query?.comments) {
      qb.leftJoinAndSelect('post.comments', 'comment');
      qb.leftJoinAndSelect('comment.user', 'commmentUser');
    }

    const post = await qb.getOne();
    console.log(post, qb.getSql());

    if (!post) {
      throw new NotFoundException();
    }

    if (query?.comments) {
      await this.repository.increment({ id }, 'views', 1);
    }

    return post;
  }

  async remove(id: number) {
    await this.byId(id);

    return this.repository.delete(id);
  }
}
