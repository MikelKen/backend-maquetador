import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';

@Entity()
export class ProjectInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column()
  email: string;

  @Column({ unique: true })
  token: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'revoked';

  @Column({ type: 'uuid' })
  invitedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Project, (project) => project.invites)
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
