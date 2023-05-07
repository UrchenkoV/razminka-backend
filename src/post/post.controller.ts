import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search.post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePostDto, @CurrentUser() user: UserEntity) {
    return this.postsService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto, @Request() req) {
    return this.postsService.update(+id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('popular')
  findPopular() {
    return this.postsService.popular();
  }

  @Get('search')
  searchPosts(@Query() dto: SearchPostDto) {
    return this.postsService.search(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query) {
    console.log(query, 'query');

    return this.postsService.byId(+id, query);
  }
}
