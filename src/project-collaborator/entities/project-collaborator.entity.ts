import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../auth/entities/auth.entity';

@Entity()
export class ProjectCollaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  invitedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Project, (project) => project.collaborators)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => User, (user) => user.collaborators)
  @JoinColumn({ name: 'userId' })
  user: User;
}
