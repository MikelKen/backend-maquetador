import { User } from 'src/auth/entities/auth.entity';
import { Project } from 'src/project/entities/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (p) => p.membres)
  project: Project;

  @ManyToOne(() => User, (u) => u.projectConnetions)
  user: User;

  @Column({ default: 'editor' })
  role: 'viewer' | 'editor' | 'owner';
}
