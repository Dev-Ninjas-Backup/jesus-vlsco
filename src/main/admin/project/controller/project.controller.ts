import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreateProjectDto } from '../dto/create-project.dto';
import { GetProjectsDto } from '../dto/get-projects.dto';
import { AssignEmployeesToProjectDto } from '../dto/project.dto';
import { GetAllProjectsService } from '../services/get-all-projects.service';
import { ProjectService } from '../services/project.service';

@ApiTags('Admin -- Project')
@Controller('admin/project')
@ValidateAdmin()
@ApiBearerAuth()
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly getAllProjectsServices: GetAllProjectsService,
  ) {}

  @ApiOperation({ summary: 'Create Project' })
  @Post()
  createProject(@Body() dto: CreateProjectDto) {
    return this.projectService.createProject(dto);
  }

  @ApiOperation({ summary: 'Assign Project to Employee' })
  @Patch(':projectId/assign-employee/:userId')
  assignProject(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.projectService.assignProjectToEmployee(projectId, userId);
  }

  @ApiOperation({ summary: 'Assign Project to Employees' })
  @Patch(':projectId/assign-employees')
  assignProjects(
    @Param('projectId') projectId: string,
    @Body() dto: AssignEmployeesToProjectDto,
  ) {
    return this.projectService.assignProjectToEmployees(
      projectId,
      dto.employees,
    );
  }

  @ApiOperation({ summary: 'Assign Project to Team or Update Project Team' })
  @Patch(':projectId/assign-team/:teamId')
  assignProjectToTeam(
    @Param('projectId') projectId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.projectService.setProjectTeam(projectId, teamId);
  }

  @ApiOperation({ summary: 'Remove Project Team' })
  @Patch(':projectId/remove-team')
  removeProjectTeam(@Param('projectId') projectId: string) {
    return this.projectService.removeProjectTeam(projectId);
  }

  @ApiOperation({ summary: 'Assign Project to Manager' })
  @Patch(':projectId/assign-manager/:managerId')
  assignProjectToManager(
    @Param('projectId') projectId: string,
    @Param('managerId') managerId: string,
  ) {
    return this.projectService.assignProjectToManager(projectId, managerId);
  }

  @ApiOperation({ summary: 'Update manager of a Project' })
  @Patch(':projectId/update-manager/:managerId')
  updateProjectManager(
    @Param('projectId') projectId: string,
    @Param('managerId') managerId: string,
  ) {
    return this.projectService.updateProjectManager(projectId, managerId);
  }

  @ApiOperation({ summary: 'Delete Project' })
  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }

  @ApiOperation({ summary: 'Get a Project' })
  @Get(':id')
  getAProject(@Param('id') id: string) {
    return this.projectService.getAProject(id);
  }

  @ApiOperation({ summary: 'Get all Projects' })
  @Get()
  async getAll(@Query() query: GetProjectsDto) {
    return this.getAllProjectsServices.getAllProjects(query);
  }
}
