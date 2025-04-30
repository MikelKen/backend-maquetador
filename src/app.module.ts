import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities/auth.entity';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { ProjectUserModule } from './project-user/project-user.module';
import { Project } from './project/entities/project.entity';

import { ProjectUser } from './project-user/entities/project-user.entity';
import { CollaborationModule } from './collaboration/collaboration.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: process.env.DATABASE_HOST,
      // port: process.env.DATABASE_PORT
      //   ? parseInt(process.env.DATABASE_PORT)
      //   : 5432,
      // username: process.env.DATABASE_USERNAME,
      // password: process.env.DATABASE_PASSWORD,
      // database: process.env.DATABASE_NAME,
      url: process.env.DATABASE_URL,
      entities: [User, Project, ProjectUser],
      synchronize: true,
    }),
    AuthModule,
    ProjectModule,
    ProjectUserModule,
    CollaborationModule,
    GeminiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
