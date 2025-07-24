import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { AnnouncementService } from './announcement.service';

@ApiTags('Employee -- Announcement')
@Controller('employee/announcement')
@ValidateEmployee()
@ApiBearerAuth()
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) { }

  @Get('assigned')
  getAssignedAnnouncements(@GetUser('userId') userId: string) {
    return this.announcementService.getAssignedAnnouncements(userId);
  }
}
