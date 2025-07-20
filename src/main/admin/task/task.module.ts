import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddTaskController } from './controller/add-task.controller';
import { TaskController } from './controller/task.controller';
import { UpdateTaskController } from './controller/update-task.controller';
import { AddTaskService } from './services/add-task.service';
import { TaskService } from './services/task.service';
import { UpdateTaskService } from './services/update-task.service';

@Module({
  controllers: [AddTaskController, UpdateTaskController, TaskController],
  providers: [
    AddTaskService,
    CloudinaryService,
    TaskService,
    UpdateTaskService,
  ],
})
export class TaskModule {}
