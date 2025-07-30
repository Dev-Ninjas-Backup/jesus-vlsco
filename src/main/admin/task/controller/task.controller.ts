import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { GetTasksDto } from '../dto/get-tasks.dto';
import { AssignEmployeesToTaskDto, UpdateTaskStatusDto } from '../dto/task.dto';
import { TaskService } from '../services/task.service';
import { GetAllTasksService } from '../services/get-all-tasks.service';

@ApiTags('Admin -- Task')
@Controller('admin/task')
@ValidateAdmin()
@ApiBearerAuth()
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly getAllTasksService: GetAllTasksService,
  ) {}

  @ApiOperation({ summary: 'Get all tasks' })
  @Get()
  async getAllTasks(@Query() query: GetTasksDto) {
    return this.getAllTasksService.getAllTasks(query);
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
  assignEmployeeToTask(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ) {
    return this.taskService.assignEmployeeToTask(taskId, userId);
  }

  @ApiOperation({ summary: 'Assign employees to task' })
  @Patch(':taskId/assign-employees')
  assignEmployeesToTask(
    @Param('taskId') taskId: string,
    @Body() dto: AssignEmployeesToTaskDto,
  ) {
    return this.taskService.assignEmployeesToTask(taskId, dto);
  }

  @ApiOperation({ summary: 'Unassign employee from task' })
  @Patch(':taskId/unassign/:userId')
  unassignEmployeeFromTask(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ) {
    return this.taskService.unassignEmployeeFromTask(taskId, userId);
  }

  @ApiOperation({ summary: 'Update project of task' })
  @Patch(':taskId/project/:projectId')
  updateProjectOfTask(
    @Param('taskId') taskId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.taskService.updateProjectOfTask(taskId, projectId);
  }

  @ApiOperation({ summary: 'Update status of task' })
  @Patch(':taskId/status')
  updateStatus(
    @Param('taskId') taskId: string,
    @Query() dto: UpdateTaskStatusDto,
  ) {
    return this.taskService.updateStatus(taskId, dto.status);
  }
}
