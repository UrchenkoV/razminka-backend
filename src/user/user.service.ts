import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { lang } from 'src/utils/lang/lang';
import { SearchUserDto } from './dto/search.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private repository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = await this.findBy({ email: dto.email });

    if (user) {
      throw new ForbiddenException(lang.ru.userWithSuchEmailExists);
    }

    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find();
  }

  async byId(id: number) {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(lang.ru.userNotFound);
    }

    return user;
  }

  findBy(cond: Pick<CreateUserDto, 'email' | 'password'>) {
    console.log(cond, 'findBy');

    return this.repository.findOneBy(cond);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.repository.update(id, dto);

    return new HttpException(lang.ru.saved, 201);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async search(dto: SearchUserDto) {
    const qb = this.repository.createQueryBuilder('u');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.email) {
      qb.where(`u.email ILIKE :email`, { email: `%${dto.email}%` });
    }

    if (dto.fullName) {
      qb.orWhere(`u.fullName ILIKE :fullName`, {
        fullName: `%${dto.fullName}%`,
      });
    }

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }
}
