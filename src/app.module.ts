import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities/auth.entity';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { ProjectUserModule } from './project-user/project-user.module';
import { Project } from './project/entities/project.entity';
// import { GrapesJsGateway } from './lib/gateway/grapesjs.gateway';
import { ProjectUser } from './project-user/entities/project-user.entity';
import { CollaborationModule } from './collaboration/collaboration.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'maquetador',
      entities: [User, Project, ProjectUser],
      synchronize: true,
    }),
    AuthModule,
    ProjectModule,
    ProjectUserModule,
    CollaborationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // providers: [AppService, GrapesJsGateway],
})
export class AppModule {}
