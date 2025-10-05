import { Prisma } from '@prisma/client';
import { IsString, MaxLength } from 'class-validator';

export class CreatePostDto implements Prisma.PostCreateInput {
  @IsString()
  @MaxLength(200, { message: 'Max Character Is 200' })
  content: string;

  user: Prisma.UserCreateNestedOneWithoutPostsInput;
}
