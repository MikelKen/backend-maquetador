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
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
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
