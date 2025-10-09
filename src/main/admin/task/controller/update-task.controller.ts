import {
  Body,
  Controller,
  Param,
  Patch,
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
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { FileService } from '@project/lib/file/file.service';
import { FileType, MulterService } from '@project/lib/multer/multer.service';
import { updateTaskSwaggerSchema } from '../dto/task.swagger';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { UpdateTaskService } from '../services/update-task.service';

@ApiTags('Admin -- Task')
@Controller('admin/task')
@ValidateAdmin()
@ApiBearerAuth()
export class UpdateTaskController {
  constructor(
    private readonly updateTaskService: UpdateTaskService,
    private readonly fileService: FileService,
  ) {}

  @Patch(':taskId')
  @ApiOperation({
    summary: 'Update an existing task (with optional new attachment)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: updateTaskSwaggerSchema.properties },
  })
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      new MulterService().createMulterOptions('./temp', 'temp', FileType.IMAGE),
    ),
  )
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedUrl: string | null = null;
    if (file) {
      uploadedUrl = (await this.fileService.processUploadedFile(file)).url;
    }
    return this.updateTaskService.updateTask(taskId, dto, uploadedUrl);
  }
}
