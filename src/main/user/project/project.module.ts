import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './services/project.service';
import { SubmitTaskService } from './services/submit-task.service';
import { GetAllTasksService } from '@project/main/admin/task/services/get-all-tasks.service';

@Module({
  controllers: [ProjectController],
  providers: [
    ProjectService,
    SubmitTaskService,
    CloudinaryService,
    GetAllTasksService,
  ],
})
export class ProjectModule {}
