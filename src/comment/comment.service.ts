import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private repository: Repository<CommentEntity>,
  ) {}

  create(dto: CreateCommentDto, userId: number) {
    return this.repository.save({
      text: dto.text,
      post: { id: dto.postId },
      user: { id: userId },
    });
  }

  findAll() {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['user', 'post'],
    });
  }

  async byId(id: number) {
    const data = await this.repository.findOneBy({ id });

    if (!data) throw new NotFoundException();

    return data;
  }

  async update(id: number, dto: UpdateCommentDto, userId: number) {
    const qb = this.repository.createQueryBuilder('c');
    qb.where('c.id = :id', { id });
    qb.andWhere('c.userId = :userId', { userId });
    const comment = await qb.getOne();

    console.log(comment, 'update');
    if (!comment) {
      throw new ForbiddenException();
    }

    return this.repository.update(id, { text: dto.text });
  }

  async remove(id: number) {
    await this.byId(id);
    return this.repository.delete(id);
  }
}
