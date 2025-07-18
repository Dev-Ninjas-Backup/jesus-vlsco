import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectService } from '../services/project.service';

@ApiTags('Admin -- Project')
@Controller('admin/project')
@ValidateAdmin()
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Create Project' })
  @Post()
  createProject(@Body() dto: CreateProjectDto) {
    return this.projectService.createProject(dto);
  }

  @ApiOperation({ summary: 'Assign Project' })
  @Post('/:projectId/assign/:userId')
  assignProject(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.projectService.assignProjectToEmployee(projectId, userId);
  }
}
