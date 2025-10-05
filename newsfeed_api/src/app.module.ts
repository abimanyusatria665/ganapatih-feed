import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [PrismaModule, AuthModule, PostModule, FollowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
