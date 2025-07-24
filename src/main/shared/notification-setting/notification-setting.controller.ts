import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { TResponse } from '@project/common/utils/response.util';
import { NotificationToggleDto } from './dto/notification-toggle.dto';
import { NotificationSettingService } from './notification-setting.service';

@ApiTags('Notification Setting')
@ValidateAuth()
@ApiBearerAuth()
@Controller('notification-setting')
export class NotificationSettingController {
  constructor(
    private readonly notificationSettingService: NotificationSettingService,
  ) { }

  @Get()
  async getNotificationSetting(
    @GetUser('userId') userId: string,
  ): Promise<TResponse<any>> {
    return await this.notificationSettingService.getNotificationSetting(userId);
  }

  @Patch()
  async updateNotificationSetting(
    @GetUser('userId') userId: string,
    @Body() dto: NotificationToggleDto,
  ): Promise<TResponse<any>> {
    return await this.notificationSettingService.updateNotificationSetting(
      userId,
      dto,
    );
  }
}
