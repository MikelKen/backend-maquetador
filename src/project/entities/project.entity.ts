import { ProjectUser } from 'src/project-user/entities/project-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  shareId: string;

  @OneToMany(() => ProjectUser, (pu) => pu.project)
  membres: ProjectUser[];
}
