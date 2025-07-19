import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddTaskController } from './controller/add-task.controller';
import { TaskController } from './controller/task.controller';
import { AddTaskService } from './services/add-task.service';
import { TaskService } from './services/task.service';

@Module({
  controllers: [AddTaskController, TaskController],
  providers: [AddTaskService, CloudinaryService, TaskService],
})
export class TaskModule { }
