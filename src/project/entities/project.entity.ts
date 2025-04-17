import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/auth.entity';
import { ProjectCollaborator } from '../../project-collaborator/entities/project-collaborator.entity';
import { ProjectInvite } from '../../project-invite/entities/project-invite.entity';
import { Room } from '../../room/entities/room.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: false })
  isPublicLink: boolean;

  @Column({ unique: true })
  publicToken: string;

  @Column({ type: 'uuid' })
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => ProjectCollaborator, (c) => c.project)
  collaborators: ProjectCollaborator[];

  @OneToMany(() => ProjectInvite, (i) => i.project)
  invites: ProjectInvite[];

  @OneToMany(() => Room, (r) => r.project)
  rooms: Room[];
}
