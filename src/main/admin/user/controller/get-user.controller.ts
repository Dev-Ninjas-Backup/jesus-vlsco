import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { GetUsersDto } from '../dto/get-users.dto';
import { GetUserService } from '../services/get-user.service';

@ApiTags('Admin -- Get User')
@ValidateAuth()
@ApiBearerAuth()
@Controller('admin/user')
export class GetUserController {
  constructor(private readonly getUserService: GetUserService) { }

  // All user get (employee)
  @Get()
  @ApiOperation({
    summary: 'Get all users with optional filters, search, and pagination',
  })
  async getAllUsers(@Query() query: GetUsersDto) {
    return await this.getUserService.getAllUsers(query);
  }

  // Single User get by Id (employee)
  @Get('id/:id')
  async getUserById(@Param('id') id: string) {
    return this.getUserService.getUserById(id);
  }

  // Single User get by email (employee)
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.getUserService.getUserByEmail(email);
  }

  // // Single User get by phone number (employee)
  // @Get('phone/:phone')
  // async getUserByPhone(@Param('phone') phone: string) {
  //   return this.getUserService.getUserByPhone(phone);
  // }

  // // Single User get by employeeID (employee)
  // @Get('employeeID/:employeeID')
  // async getUserByEmployeeID(@Param('employeeID') employeeID: number) {
  //   return this.getUserService.getUserByEmployeeID(employeeID);
  // }

  @Get('me/profile')
  async getMe(@GetUser('userId') userId: string) {
    return this.getUserService.getUserById(userId);
  }
}
