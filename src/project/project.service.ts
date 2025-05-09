import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUser } from 'src/project-user/entities/project-user.entity';
import { User } from 'src/auth/entities/auth.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
  ) {}
  async create(
    dto: CreateProjectDto,
    userId: string,
  ): Promise<{ shareId: string }> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('No se encontro el usuario');
    const project = this.projectRepository.create({
      name: dto.name,
      shareId: uuidv4(),
      user,
    });

    await this.projectRepository.save(project);

    const projectUser = this.projectUserRepository.create({
      user,
      project,
      role: 'owner',
    });
    await this.projectUserRepository.save(projectUser);
    return { shareId: project.shareId };
  }

  findAll(userId: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  async update(shareId: string, dto: UpdateProjectDto): Promise<Project> {
    const projectExits = await this.projectRepository.findOne({
      where: { shareId },
    });

    console.log(projectExits);

    if (!projectExits) throw new Error('No se encontro el proyecto');

    await this.projectRepository.update(projectExits.id, dto);
    const project = await this.projectRepository.findOneOrFail({
      where: { id: projectExits.id },
    });

    return project;
  }

  async remove(shareId: string): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { shareId },
    });

    if (!project) {
      throw new Error('No se encontró el proyecto');
    }

    const projectUsers = await this.projectUserRepository.find({
      where: { project: { id: project.id } },
    });

    if (projectUsers.length > 0) {
      await this.projectUserRepository.remove(projectUsers);
    }

    await this.projectRepository.remove(project);
  }

  async findByShareId(shareId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { shareId },
    });

    if (!project) throw new Error('No se encontro el proyecto');
    return project;
  }

  async isUserMember(projectId: string, userId: string): Promise<boolean> {
    const connection = await this.projectUserRepository.findOne({
      where: {
        project: { id: projectId },
        user: { id: userId },
      },
    });
    return !!connection;
  }

  async addUserToProject(projectId: string, userId: string): Promise<void> {
    const project = await this.projectRepository.findOneOrFail({
      where: { id: projectId },
    });
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    const connection = this.projectUserRepository.create({
      project,
      user,
      role: 'editor',
    });

    await this.projectUserRepository.save(connection);
  }
}
