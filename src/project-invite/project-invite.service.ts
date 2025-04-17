import { Injectable } from '@nestjs/common';
import { CreateProjectInviteDto } from './dto/create-project-invite.dto';
import { UpdateProjectInviteDto } from './dto/update-project-invite.dto';

@Injectable()
export class ProjectInviteService {
  create(createProjectInviteDto: CreateProjectInviteDto) {
    return 'This action adds a new projectInvite';
  }

  findAll() {
    return `This action returns all projectInvite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectInvite`;
  }

  update(id: number, updateProjectInviteDto: UpdateProjectInviteDto) {
    return `This action updates a #${id} projectInvite`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectInvite`;
  }
}
