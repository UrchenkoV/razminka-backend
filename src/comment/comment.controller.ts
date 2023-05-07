import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateCommentDto, @Request() req) {
    return this.commentService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.byId(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.commentService.update(+id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
