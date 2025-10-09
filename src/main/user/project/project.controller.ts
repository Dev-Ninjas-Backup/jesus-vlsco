import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { FileService } from '@project/lib/file/file.service';
import { FileType, MulterService } from '@project/lib/multer/multer.service';
import { GetTasksDto } from '@project/main/admin/task/dto/get-tasks.dto';
import { GetAllTasksService } from '@project/main/admin/task/services/get-all-tasks.service';
import { ProjectService } from './services/project.service';
import { SubmitTaskService } from './services/submit-task.service';

@ApiTags('Employee -- Project & Task')
@Controller('employee/project')
@ValidateAuth()
@ApiBearerAuth()
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly getAllTasksService: GetAllTasksService,
    private readonly submitTaskService: SubmitTaskService,
    private readonly fileService: FileService,
  ) {}

  @Get('all')
  async getAllProjectsList(@Query() dto: PaginationDto) {
    return this.projectService.getAllProjectWithItsTasks(dto);
  }

  @Get('task/all')
  getAllProject(@Query() dto: GetTasksDto, @GetUser('userId') userId: string) {
    const dtoWithUser = { ...dto, userId };

    return this.getAllTasksService.getAllTasks(dtoWithUser);
  }

  @Get('task/:taskId')
  getMyProject(
    @Param('taskId') taskId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.projectService.getATask(taskId, userId);
  }

  @Patch('start/:taskId')
  startMyProject(
    @Param('taskId') taskId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.projectService.startATask(taskId, userId);
  }

  @Patch('submit/:taskId')
  @ApiOperation({
    summary: 'Update an existing task (with optional new attachment)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: { attachment: { type: 'file' } } },
  })
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      new MulterService().createMulterOptions('./temp', 'temp', FileType.IMAGE),
    ),
  )
  async updateTask(
    @Param('taskId') taskId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedUrl: string | null = null;

    if (file) {
      uploadedUrl = (await this.fileService.processUploadedFile(file)).url;
    }
    return this.submitTaskService.submitTask(taskId, uploadedUrl);
  }
}
