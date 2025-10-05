import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class RegisterDto implements Prisma.UserCreateInput {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
