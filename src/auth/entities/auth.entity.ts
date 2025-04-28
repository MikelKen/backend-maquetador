import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectUser } from 'src/project-user/entities/project-user.entity';
import { Project } from 'src/project/entities/project.entity';

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

  @OneToMany(() => Project, (p) => p.user)
  projects: Project[];

  @OneToMany(() => ProjectUser, (pu) => pu.user)
  projectConnetions: ProjectUser[];
}
