import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './services/project.service';
import { SubmitTaskService } from './services/submit-task.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, SubmitTaskService, CloudinaryService],
})
export class ProjectModule {}
