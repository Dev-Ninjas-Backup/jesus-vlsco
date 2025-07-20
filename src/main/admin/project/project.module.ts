import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './services/project.service';
import { GetAllProjectsService } from './services/get-all-projects.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, GetAllProjectsService],
})
export class ProjectModule {}
