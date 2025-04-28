import { User } from 'src/auth/entities/auth.entity';
import { ProjectUser } from 'src/project-user/entities/project-user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  shareId: string;

  @ManyToOne(() => User, (u) => u.projects)
  user: User;

  @OneToMany(() => ProjectUser, (pu) => pu.project)
  membres: ProjectUser[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
