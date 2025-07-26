import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProjectService } from './services/project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
}
