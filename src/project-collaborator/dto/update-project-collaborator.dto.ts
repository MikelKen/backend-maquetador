import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectCollaboratorDto } from './create-project-collaborator.dto';

export class UpdateProjectCollaboratorDto extends PartialType(CreateProjectCollaboratorDto) {}
