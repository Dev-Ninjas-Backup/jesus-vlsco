import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { AssignEmployeesToTaskDto } from '../dto/task.dto';
import { TaskService } from '../services/task.service';

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

  @ApiOperation({ summary: 'Get task by id' })
  @Get(':taskId')
  getTaskById(@Param('taskId') taskId: string) {
    return this.taskService.getTaskById(taskId);
  }

  @ApiOperation({ summary: 'Delete task' })
  @Delete(':taskId')
  deleteTask(@Param('taskId') taskId: string) {
    return this.taskService.deleteTask(taskId);
  }

  @ApiOperation({ summary: 'Assign employee to task' })
  @Patch(':taskId/assign/:userId')
  assignEmployeeToTask(@Param('taskId') taskId: string, @Param('userId') userId: string) {
    return this.taskService.assignEmployeeToTask(taskId, userId);
  }

  @ApiOperation({ summary: 'Assign employees to task' })
  @Patch(':taskId/assign-employees')
  assignEmployeesToTask(@Param('taskId') taskId: string, @Body() dto: AssignEmployeesToTaskDto) {
    return this.taskService.assignEmployeesToTask(taskId, dto);
  }

  @ApiOperation({ summary: 'Unassign employee from task' })
  @Patch(':taskId/unassign/:userId')
  unassignEmployeeFromTask(@Param('taskId') taskId: string, @Param('userId') userId: string) {
    return this.taskService.unassignEmployeeFromTask(taskId, userId);
  }
}
