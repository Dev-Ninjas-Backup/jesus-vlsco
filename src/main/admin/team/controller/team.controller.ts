import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { createTeamSwaggerSchema } from '../dto/createTeam.swagger';
import { GetTeamsDto } from '../dto/get-teams.dto';
import { AddMembersToTeamDto, CreateTeamDto } from '../dto/team.dto';
import { GetAllTeamsService } from '../services/get-all-team.service';
import { TeamService } from '../services/team.service';

@ApiTags('Admin -- Team')
@Controller('admin/team')
@ValidateAdmin()
@ApiBearerAuth()
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly getAllTeamsService: GetAllTeamsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiOperation({ summary: 'Get all teams' })
  @Get('get-all-teams')
  async getAllTeams(@Query() query: GetTeamsDto) {
    return this.getAllTeamsService.getAllTeamsService(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a team' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: createTeamSwaggerSchema.properties,
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async createATeam(
    @GetUser('userId') userId: string,
    @Body() dto: CreateTeamDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedUrl: string | null = null;

    uploadedUrl = (
      await this.cloudinaryService.uploadImageFromBuffer(
        file.buffer,
        file.originalname,
      )
    ).url;

    // if (!Array.isArray(dto.members)) {
    //   dto.members = dto.members ? [dto.members] : [];
    // }
    return this.teamService.createATeam(dto, userId, uploadedUrl);
  }

  @ApiOperation({ summary: 'Update a team' })
  @Patch(':teamId')
  async updateATeam(
    @Body() dto: CreateTeamDto,
    @Param('teamId') teamId: string,
  ) {
    return this.teamService.updateATeam(teamId, dto);
  }

  @ApiOperation({ summary: 'Delete a team' })
  @Delete(':teamId')
  async deleteATeam(@Param('teamId') teamId: string) {
    return this.teamService.deleteATeam(teamId);
  }

  @ApiOperation({ summary: 'Get A Team' })
  @Get(':teamId')
  async getATeam(@Param('teamId') teamId: string) {
    return this.teamService.getATeam(teamId);
  }

  @ApiOperation({ summary: 'Get team projects' })
  @Get(':teamId/projects')
  async getTeamProjects(@Param('teamId') teamId: string) {
    return this.teamService.getTeamProjects(teamId);
  }

  @ApiOperation({ summary: 'Add user to team' })
  @Patch(':teamId/add-user/:userId')
  async addMemberToTeam(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamService.addMemberToTeam(teamId, userId);
  }

  @ApiOperation({ summary: 'Add users to team' })
  @Patch(':teamId/users')
  async addMembersToTeam(
    @Param('teamId') teamId: string,
    @Body() addMembersToTeamDto: AddMembersToTeamDto,
  ) {
    return this.teamService.addMembersToTeam(
      teamId,
      addMembersToTeamDto.members,
    );
  }

  @ApiOperation({ summary: 'Get team members' })
  @Get(':teamId/members')
  async getTeamMembers(@Param('teamId') teamId: string) {
    return this.teamService.getTeamMembers(teamId);
  }

  @ApiOperation({ summary: 'Add admin to team' })
  @Patch(':teamId/add-admin/:userId')
  async addAdminToTeam(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamService.addAdminToTeam(teamId, userId);
  }

  @ApiOperation({ summary: 'Get team admins' })
  @Get(':teamId/admins')
  async getTeamAdminsOfATeam(@Param('teamId') teamId: string) {
    return this.teamService.getTeamAdminsOfATeam(teamId);
  }

  @ApiOperation({ summary: 'Convert user to admin' })
  @Patch(':teamId/admin/:userId')
  async convertUserToAdmin(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamService.convertUserToAdmin(teamId, userId);
  }

  @ApiOperation({ summary: 'Convert admin to user' })
  @Patch(':teamId/user/:userId')
  async convertAdminToUser(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamService.convertAdminToUser(teamId, userId);
  }

  @ApiOperation({ summary: 'Remove user from team' })
  @Delete(':teamId/user/:userId')
  async removeMemberFromTeam(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamService.removeMemberFromTeam(teamId, userId);
  }
}
