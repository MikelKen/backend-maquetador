import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectInviteService } from './project-invite.service';
import { CreateProjectInviteDto } from './dto/create-project-invite.dto';
import { UpdateProjectInviteDto } from './dto/update-project-invite.dto';

@Controller('project-invite')
export class ProjectInviteController {
  constructor(private readonly projectInviteService: ProjectInviteService) {}

  @Post()
  create(@Body() createProjectInviteDto: CreateProjectInviteDto) {
    return this.projectInviteService.create(createProjectInviteDto);
  }

  @Get()
  findAll() {
    return this.projectInviteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectInviteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectInviteDto: UpdateProjectInviteDto) {
    return this.projectInviteService.update(+id, updateProjectInviteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectInviteService.remove(+id);
  }
}
