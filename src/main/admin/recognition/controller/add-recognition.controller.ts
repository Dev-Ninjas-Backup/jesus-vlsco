import { Body, Controller, Post } from '@nestjs/common';
import { AddRecognitionService } from '../services/add-recognition.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { addRecognitionSwaggerScham } from '../dto/add-recognition.swagger';
import { AddRecognitionDto } from '../dto/add-recognition.dto';

@ApiTags('Admin -- Recognition')
@Controller('admin/recognition')
@ValidateAdmin()
@ApiBearerAuth()
export class AddRecognitionController {
    constructor(private readonly addRecognitionService:AddRecognitionService){}

    @Post('/add-recognition')
    @ApiBody(
        {
            description:"Recognition Creation",
            schema: {
                type:'object',
                properties:{...addRecognitionSwaggerScham.properties}
            }
        }
    )
    async addRecognition(@Body() dto:AddRecognitionDto){
        return await this.addRecognitionService.addRecognition(dto)
    }
}
