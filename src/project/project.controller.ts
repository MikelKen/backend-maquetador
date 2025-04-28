import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';
import { JwtRequestUser } from 'src/auth/interfaces/jwt-payload';
import { Request as ExpressRequest } from 'express';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: ExpressRequest,
  ) {
    const userId = (req.user as JwtRequestUser).id;
    return await this.projectService.create(createProjectDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: ExpressRequest) {
    const userId = (req.user as JwtRequestUser).id;
    return this.projectService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }

  @Get('share/:shareId')
  @UseGuards(JwtAuthGuard)
  async acccessProject(
    @Param('shareId') shareId: string,
    @Request() req: ExpressRequest,
  ) {
    const project = await this.projectService.findByShareId(shareId);
    const user = req.user as JwtRequestUser;

    const alreadyMember = await this.projectService.isUserMember(
      project.id,
      user.id,
    );
    if (!alreadyMember) {
      await this.projectService.addUserToProject(project.id, user.id);
    }
    return project;
  }
}
