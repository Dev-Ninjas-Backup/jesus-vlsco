import {
  Controller,
  Get,
  Param,
  Patch,
  Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { ProjectService } from './services/project.service';

@ApiTags('Employee -- Project')
@Controller('employee/project')
@ValidateEmployee()
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Get('all')
  getAllProject(@Query() dto: PaginationDto) {
    return this.projectService.getAllProjectWithItsTasks(dto);
  }

  @Get('task/:taskId')
  getMyProject(@Param("taskId") taskId: string, @GetUser('userId') userId: string) {
    return this.projectService.getATask(taskId, userId);
  }

  @Patch('start/:taskId')
  startMyProject(@Param("taskId") taskId: string, @GetUser('userId') userId: string) {
    return this.projectService.startATask(taskId, userId);
  }
}
