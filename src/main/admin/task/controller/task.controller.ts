import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskService } from '../services/task.service';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';

@ApiTags('Admin -- Task')
@Controller('admin/task')
@ValidateAdmin()
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @ApiOperation({ summary: 'Get all tasks' })
  @Get()
  getAllTasks() {
    return this.taskService.getAllTasks();
  }
}
