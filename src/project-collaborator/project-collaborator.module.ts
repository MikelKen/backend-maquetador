import { Module } from '@nestjs/common';
import { ProjectCollaboratorService } from './project-collaborator.service';
import { ProjectCollaboratorController } from './project-collaborator.controller';

@Module({
  controllers: [ProjectCollaboratorController],
  providers: [ProjectCollaboratorService],
})
export class ProjectCollaboratorModule {}
