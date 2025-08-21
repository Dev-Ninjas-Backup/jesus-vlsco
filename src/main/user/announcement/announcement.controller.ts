import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { AnnouncementService } from './announcement.service';

@ApiTags('Employee -- Announcement')
@Controller('employee/announcement')
@ValidateEmployee()
@ApiBearerAuth()
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get('assigned')
  getAssignedAnnouncements(@GetUser('userId') userId: string) {
    return this.announcementService.getAssignedAnnouncements(userId);
  }

  @Get(':announcementId')
  getSingleAnnouncement(@Param('announcementId') announcementId: string) {
    return this.announcementService.getSingleAnnouncement(announcementId);
  }

  @Post('like/:announcementId')
  likeAnnouncement(
    @GetUser('userId') userId: string,
    @Param('announcementId') announcementId: string,
  ) {
    return this.announcementService.likeAnnouncement(userId, announcementId);
  }
}
