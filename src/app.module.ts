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
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT
        ? parseInt(process.env.DATABASE_PORT)
        : 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
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
