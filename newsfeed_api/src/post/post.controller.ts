import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  async create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postService.create(createPostDto, req.user.user_id);
  }

  @Get('/timeline')
  async getTimeline(
    @Req() req: any,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.postService.getFollowingPost(req.user.user_id, +page, +limit);
  }

  @Get(':userId')
  async getUserPost(@Param('userId') userId: number) {
    return this.postService.getUserPost(+userId);
  }
}
