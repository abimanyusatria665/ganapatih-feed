import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('/follow/:targetId')
  async Follow(@Param('targetId') targetId: string, @Req() req: any) {
    return await this.followService.follow(+req.user.user_id, +targetId);
  }

  @Post('/unfollow/:targetId')
  async Unfollow(
    @Param('targetId', ParseIntPipe) targetId: number,
    @Req() req,
  ) {
    return await this.followService.unfollow(req.user.user_id, targetId);
  }

  @Get('/followers/counts')
  async counts(@Req() req) {
    return await this.followService.counts(req.user.user_id);
  }

  @Get('/followers/:userId')
  async getFollowers(@Param('userId', ParseIntPipe) userId: number) {
    return await this.followService.followerList(userId);
  }

  @Get('/following/:userId')
  async getFollowing(@Param('userId', ParseIntPipe) userId: number) {
    return await this.followService.followingList(userId);
  }

  @Get('/profile/:username')
  async getProfile(@Param('username') username: string, @Req() req) {
    return await this.followService.getProfile(username, req.user.user_id);
  }

  @Get('/search')
  async searchUsers(@Query('query') query: string) {
    return this.followService.searchUsers(query);
  }
}
