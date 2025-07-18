import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddTaskController } from './controller/add-task.controller';
import { AddTaskService } from './services/add-task.service';

@Module({
  controllers: [AddTaskController],
  providers: [AddTaskService, CloudinaryService],
})
export class TaskModule {}
