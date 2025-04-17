import { Module } from '@nestjs/common';
import { ProjectInviteService } from './project-invite.service';
import { ProjectInviteController } from './project-invite.controller';

@Module({
  controllers: [ProjectInviteController],
  providers: [ProjectInviteService],
})
export class ProjectInviteModule {}
