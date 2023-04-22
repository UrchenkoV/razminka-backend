import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { SearchPostDto } from './dto/search.post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity) private repository: Repository<PostEntity>,
  ) {}

  create(dto: CreatePostDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
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

  async findOne(id: number, isInc: boolean = true) {
    const post = await this.repository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException();
    }

    if (isInc) {
      await this.repository.increment({ id }, 'views', 1);
    }

    return post;
  }

  async update(id: number, dto: UpdatePostDto) {
    await this.findOne(id, false);

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id, false);

    return this.repository.delete(id);
  }
}
