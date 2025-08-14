import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { addBranchSwagger } from '../dto/add-branch-in-company.swagger';
import { CreateCompanyWithBranchDto } from '../dto/createCompany.dto';
import { createCompanyWithBranchSwaggerSchema } from '../dto/createCompany.swagger';
import { CreateCompanyBranchNestedDto } from '../dto/createCompanyBranch.dto';
import { ManageProjectDto } from '../dto/manage-project.dto';
import { UpdateCompanyWithBranchesDto } from '../dto/updateCompany.dto';
import { updateCompanyWithBranchesSwagger } from '../dto/updateCompanyWithBranch.swagger';
import { AddBranchService } from '../services/add-branch.service';
import { CreateCompanyService } from '../services/create-company.service';
import { DeleteCompanyBranchService } from '../services/delete-company-branch.service';
import { ManageProjectsService } from '../services/manage-projects.service';
import { SettingsService } from '../services/settings.service';
import { UpdateCompanyService } from '../services/update-company.service';

@ApiTags('Admin -- Settings')
@Controller('admin/settings')
@ValidateAdmin()
@ApiBearerAuth()
export class SettingsController {
  constructor(
    private readonly createCompanyService: CreateCompanyService,
    private readonly updateCompanyService: UpdateCompanyService,
    private readonly getCompanyService: SettingsService,
    private readonly addBranchService: AddBranchService,
    private readonly deleteCompanyBranchService: DeleteCompanyBranchService,
    private readonly manageProjectsService: ManageProjectsService,
  ) {}

  // Get all companies with branches
  @Get('get-companies')
  async getCompanies() {
    return this.getCompanyService.getCompanyWithBranches();
  }

  // create and update company and branches
  @Post('create-company')
  @ApiBody({
    description: 'Company creation with branches',
    schema: {
      type: 'object',
      properties: {
        ...createCompanyWithBranchSwaggerSchema.properties,
      },
      required: ['name', 'location'],
    },
  })
  async createCompany(@Body() dto: CreateCompanyWithBranchDto) {
    return this.createCompanyService.createCompany(dto);
  }

  // Update company and branches
  @Patch('update-company/:companyId')
  @ApiBody({
    description: 'Update company and branches',
    schema: {
      ...updateCompanyWithBranchesSwagger.schema,
      properties: {
        ...updateCompanyWithBranchesSwagger.schema.properties,
      },
    },
  })
  async updateCompany(
    @Param('companyId') companyId: string,
    @Body() dto: UpdateCompanyWithBranchesDto,
  ) {
    return this.updateCompanyService.updateCompanyWithBranches(companyId, dto);
  }

  // Add a new branch to an existing company
  @Post('add-branch/:companyId')
  @ApiBody({
    description: 'Add a new branch to an existing company',
    schema: {
      ...addBranchSwagger,
    },
  })
  async addBranch(
    @Param('companyId') companyId: string,
    @Body() dto: CreateCompanyBranchNestedDto,
  ) {
    return this.addBranchService.addBranchToCompany(companyId, dto);
  }

  // Delete a branch from a company
  @Delete('delete-branch/:branchId')
  @ApiBody({
    description: 'Delete a branch from a company',
    schema: {
      type: 'object',
      properties: {
        companyId: {
          type: 'string',
          example: 'company_12345',
          description: 'ID of the company to which the branch belongs',
        },
      },
      required: ['companyId'],
    },
  })
  async deleteBranch(
    @Param('branchId') branchId: string,
    @Body('companyId') companyId: string,
  ) {
    return this.deleteCompanyBranchService.deleteBranch(companyId, branchId);
  }

  // Get all projects
  @Get('projects/all')
  async getProjectsWithManagers() {
    return this.getCompanyService.getProjectsWithManagers();
  }

  // Manage projects
  @Patch('projects/manage')
  async manageProjects(@Body() dto: ManageProjectDto) {
    return this.manageProjectsService.manageProjects(dto);
  }
}
