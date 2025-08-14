import {
  Body,
  Controller,
  Post,
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
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddTaskDto } from '../dto/add-task.dto';
import { addTaskSwaggerSchema } from '../dto/task.swagger';
import { AddTaskService } from '../services/add-task.service';

@ApiTags('Admin -- Add Task')
@Controller('admin/task/add')
@ValidateAdmin()
@ApiBearerAuth()
export class AddTaskController {
  constructor(
    private readonly addTaskService: AddTaskService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task with document attachment' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Task creation form data with optional document',
    schema: {
      type: 'object',
      properties: {
        ...addTaskSwaggerSchema.properties,
        attachment: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('attachment'))
  async createTask(
    @Body() dto: AddTaskDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedUrl = null;

    if (file) {
      uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(
        file.buffer,
        file.originalname,
      );
    }

    return this.addTaskService.createTask(dto, uploadedUrl?.url || null);
  }
}
