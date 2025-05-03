import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { MemberRepository } from './repository/member.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MembersController],
  providers: [MembersService, MemberRepository, PrismaService],
})
export class MembersModule {}
