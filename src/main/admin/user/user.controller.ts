import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEnum } from '@project/common/enum/user.enum';
import { Roles } from '@project/common/jwt/jwt-roles.decorator';
import { AddProfileDto } from './dto/add-profile-info.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileType, MulterService } from '@project/lib/multer/multer.service';
@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'))
@Roles(UserEnum.Admin)
@ApiBearerAuth()



export class UserController {


  //user profile data saving into db
  @Post('user/add-profile-into')
  @ApiOperation({ summary: 'Create a new user profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully.' })
  @UseInterceptors(
    FileInterceptor(
      'pic',
      new MulterService().createMulterOptions('./temp', 'temp', FileType.IMAGE),
    ),
  )
  @ApiConsumes('multipart/form-data', 'application/json')
  async addProfile(@Body() addProfileDto: AddProfileDto){

  }
}
