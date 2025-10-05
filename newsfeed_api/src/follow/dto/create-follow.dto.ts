import { Prisma } from '@prisma/client';

export class CreateFollowDto implements Prisma.FollowCreateInput {
  follower: Prisma.UserCreateNestedOneWithoutFollowersInput;
  followee: Prisma.UserCreateNestedOneWithoutFollowingInput;
}
