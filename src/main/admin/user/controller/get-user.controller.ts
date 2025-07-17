import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { GetUserService } from '../services/get-user.service';

@ApiTags('Admin -- Get User')
@ValidateAdmin()
@ApiBearerAuth()
@Controller('admin/get-user')
export class GetUserController {
  constructor(private readonly getUserService: GetUserService) {}

  @Get('id/:id')
  async getUserById(@Param('id') id: string) {
    return this.getUserService.getUserById(id);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.getUserService.getUserByEmail(email);
  }

  @Get('phone/:phone')
  async getUserByPhone(@Param('phone') phone: string) {
    return this.getUserService.getUserByPhone(phone);
  }

  @Get('employeeID/:employeeID')
  async getUserByEmployeeID(@Param('employeeID') employeeID: number) {
    return this.getUserService.getUserByEmployeeID(employeeID);
  }
}
