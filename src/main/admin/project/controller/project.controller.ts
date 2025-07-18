import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { ProjectService } from '../services/project.service';

@ApiTags('Admin -- Project')
@Controller('admin/project')
@ValidateAdmin()
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Create Project' })
  @Post()
  async createProject() {
    return this.projectService.createProject();
  }
}
