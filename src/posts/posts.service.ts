import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity) private repository: Repository<PostEntity>,
  ) {}

  create(dto: CreatePostDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const post = await this.repository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async update(id: number, dto: UpdatePostDto) {
    await this.findOne(id);

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.repository.delete(id);
  }
}
