import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities/auth.entity';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { ProjectColaboratorModule } from './project-colaborator/project-colaborator.module';
import { ProjectInviteModule } from './project-invite/project-invite.module';
import { RoomModule } from './room/room.module';
import { ProjectCollaboratorModule } from './project-collaborator/project-collaborator.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'maquetador',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    ProjectModule,
    ProjectColaboratorModule,
    ProjectInviteModule,
    RoomModule,
    ProjectCollaboratorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
