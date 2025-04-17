import { Project } from 'src/project/entities/project.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectCollaborator } from 'src/project-collaborator/entities/project-collaborator.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  @OneToMany(() => ProjectCollaborator, (pc) => pc.user)
  collaborators: ProjectCollaborator[];
}
