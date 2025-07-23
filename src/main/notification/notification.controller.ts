import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAuth } from '@project/common/jwt/jwt.decorator';

@ApiTags('Notification')
@ApiBearerAuth()
@ValidateAuth()
@Controller('notification')
export class NotificationController {
  constructor() {}
}
