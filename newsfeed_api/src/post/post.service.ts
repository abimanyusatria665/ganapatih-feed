import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private dbService: PrismaService) {}

  async create(createPostDto: CreatePostDto, user_id) {
    try {
      const post = await this.dbService.post.create({
        data: {
          content: createPostDto.content,
          user: {
            connect: {
              id: user_id,
            },
          },
        },
      });
      return {
        statusCode: 201,
        data: post,
      };
    } catch (error) {
      throw new HttpException(
        'Max Character Is 200',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async getUserPost(userId: number) {
    const posts = await this.dbService.post.findMany({
      where: { userId },
      include: { user: { select: { id: true, username: true } } }, // biar ada data user juga
      orderBy: { createdAt: 'desc' },
    });
    return posts;
  }

  async getFollowingPost(userId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const followingIds = await this.dbService.follow.findMany({
      where: { followerId: userId },
      select: { followeeId: true },
    });

    const ids = followingIds.map((f) => f.followeeId);
    ids.push(userId); // supaya post sendiri juga muncul

    if (ids.length === 0) {
      return { items: [], page, limit, total: 0 };
    }

    const [items, total] = await this.dbService.$transaction([
      this.dbService.post.findMany({
        where: { userId: { in: ids } },
        include: { user: { select: { id: true, username: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.dbService.post.count({
        where: { userId: { in: ids } },
      }),
    ]);
    return {
      statusCode: HttpStatus.OK,
      items,
      page,
      limit,
      total,
    };
  }
}
