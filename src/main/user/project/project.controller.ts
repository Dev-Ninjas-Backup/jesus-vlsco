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
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { GetTasksDto } from '@project/main/admin/task/dto/get-tasks.dto';
import { GetAllTasksService } from '@project/main/admin/task/services/get-all-tasks.service';
import { ProjectService } from './services/project.service';
import { SubmitTaskService } from './services/submit-task.service';

@ApiTags('Employee -- Project & Task')
@Controller('employee/project')
@ValidateEmployee()
@ApiBearerAuth()
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly getAllTasksService: GetAllTasksService,
    private readonly submitTaskService: SubmitTaskService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('all')
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
  @UseInterceptors(FileInterceptor('attachment'))
  async updateTask(
    @Param('taskId') taskId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedUrl: string | null = null;

    if (file) {
      uploadedUrl = (
        await this.cloudinaryService.uploadImageFromBuffer(
          file.buffer,
          file.originalname,
        )
      ).url;
    }
    return this.submitTaskService.submitTask(taskId, uploadedUrl);
  }
}
