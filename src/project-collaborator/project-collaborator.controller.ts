import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectCollaboratorService } from './project-collaborator.service';
import { CreateProjectCollaboratorDto } from './dto/create-project-collaborator.dto';
import { UpdateProjectCollaboratorDto } from './dto/update-project-collaborator.dto';

@Controller('project-collaborator')
export class ProjectCollaboratorController {
  constructor(private readonly projectCollaboratorService: ProjectCollaboratorService) {}

  @Post()
  create(@Body() createProjectCollaboratorDto: CreateProjectCollaboratorDto) {
    return this.projectCollaboratorService.create(createProjectCollaboratorDto);
  }

  @Get()
  findAll() {
    return this.projectCollaboratorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectCollaboratorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectCollaboratorDto: UpdateProjectCollaboratorDto) {
    return this.projectCollaboratorService.update(+id, updateProjectCollaboratorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectCollaboratorService.remove(+id);
  }
}
