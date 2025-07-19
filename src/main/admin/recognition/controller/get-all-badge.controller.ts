import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { GetAllBadgeService } from '../services/get-all-badge.service';

@ApiTags('Admin -- Recognition')
@Controller('admin/recognition')
@ValidateAdmin()
@ApiBearerAuth()
export class GetAllBadgeController {
  constructor(private readonly getAllBadgeService: GetAllBadgeService) {}

  // Get All Badgs
  @Get('/all-badgs')
  @ApiOperation({ summary: 'Get All Badges' })
  async getAllBadgs() {
    return await this.getAllBadgeService.getAllBadge();
  }
}
