import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FollowService {
  constructor(private dbService: PrismaService) {}

  async follow(userId: number, targetId: number) {
    if (userId === targetId) {
      throw new BadRequestException('You Cant Follow Yourself!');
    }
    const followed = await this.dbService.follow.findFirst({
      where: {
        followerId: userId,
        followeeId: targetId,
      },
    });

    if (followed) {
      throw new BadRequestException('Already Followed');
    }

    try {
      const follow = await this.dbService.follow.create({
        data: {
          followeeId: targetId,
          followerId: userId,
        },
        include: {
          followee: { select: this.userPublicSelect() },
          follower: { select: this.userPublicSelect() },
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: `You are now following ${follow.followee.username}`,
        data: follow,
      };
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException('Sudah follow');
      }
      if (this.isForeignKeyViolation(error)) {
        // target tidak ada
        throw new NotFoundException('User tidak ditemukan');
      }
    }
  }

  async counts(userId: number) {
    const [followers, following] = await this.dbService.$transaction([
      this.dbService.follow.count({ where: { followeeId: userId } }),
      this.dbService.follow.count({ where: { followerId: userId } }),
    ]);
    return { followers, following };
  }

  async followingList(userId: number) {
    const list = await this.dbService.follow.findMany({
      where: { followerId: userId },
      include: { followee: { select: this.userPublicSelect() } },
    });
    return list.map((e) => e.followee);
  }

  async followerList(userId: number) {
    const list = await this.dbService.follow.findMany({
      where: { followeeId: userId },
      include: { follower: { select: this.userPublicSelect() } },
    });
    return list.map((e) => e.follower);
  }

  async unfollow(userId: number, targetId: number) {
    try {
      const unfollow = await this.dbService.follow.delete({
        where: {
          followerId_followeeId: { followerId: userId, followeeId: targetId },
        },
        include: {
          followee: { select: this.userPublicSelect() },
          follower: { select: this.userPublicSelect() },
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: `Now you are unfollowing ${unfollow.followee.username}`,
        data: unfollow,
      };
    } catch (e) {
      if (this.isRecordNotFound(e)) {
        throw new NotFoundException('Not Following Yet');
      }
      throw e;
    }
  }

  async getProfile(username: string, userId: number) {
    // 1️⃣ Ambil user berdasarkan username
    const profile = await this.dbService.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    const posts = await this.dbService.post.findMany({
      where: { userId: profile.id },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const counts = await this.counts(profile.id);

    const rel =
      userId === profile.id
        ? { isFollowing: false, isSelf: true }
        : await this.isFollowing(userId, profile.id);

    return {
      ...profile,
      ...counts,
      ...rel,
      posts,
    };
  }

  async searchUsers(query: string) {
    return this.dbService.user.findMany({
      where: { username: { contains: query, mode: 'insensitive' } },
      select: { id: true, username: true },
    });
  }

  async isFollowing(userId: number, targetId: number) {
    const row = await this.dbService.follow.findUnique({
      where: {
        followerId_followeeId: { followerId: userId, followeeId: targetId },
      },
      select: { followerId: true },
    });
    return { isFollowing: !!row };
  }

  private userPublicSelect(): Prisma.UserSelect {
    return { id: true, username: true, createdAt: true };
  }

  private isUniqueViolation(e: unknown) {
    return (
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002'
    );
  }

  private isRecordNotFound(e: unknown) {
    return (
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025'
    );
  }

  private isForeignKeyViolation(e: unknown) {
    return (
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2003'
    );
  }
}
