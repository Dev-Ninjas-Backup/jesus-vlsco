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

  @ApiOperation({ summary: 'Assign Project to Employee' })
  @Post('/:projectId/assign-employee/:userId')
  assignProject(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.projectService.assignProjectToEmployee(projectId, userId);
  }

  @ApiOperation({ summary: 'Assign Project to Team' })
  @Post('/:projectId/assign-team/:teamId')
  assignProjectToTeam(
    @Param('projectId') projectId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.projectService.assignProjectToTeam(projectId, teamId);
  }

  @ApiOperation({ summary: 'Assign Project to Manager' })
  @Post('/:projectId/assign-manager/:managerId')
  assignProjectToManager(
    @Param('projectId') projectId: string,
    @Param('managerId') managerId: string,
  ) {
    return this.projectService.assignProjectToManager(projectId, managerId);
  }
}
