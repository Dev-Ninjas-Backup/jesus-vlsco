import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { UpdateRecognitionService } from '../services/update-recognition.service';
import { addRecognitionSwaggerScham } from '../dto/add-recognition.swagger';
import { UpdateRecognitionDto } from '../dto/update-recognition.dto';

@ApiTags('Admin -- Recognition')
@Controller('admin/recognition')
@ValidateAdmin()
@ApiBearerAuth()
export class UpdateRecognitionController {
    
      constructor(private readonly updateAndDeleteReconitionService:UpdateRecognitionService){}

    //  Update Recognition
        @Patch('recongnition-update/:id')
        @ApiBody(
                {
                    description:"Recognition Update",
                    schema: {
                        type:'object',
                        properties:{...addRecognitionSwaggerScham.properties}
                    }
                }
            )
        async updateRecognition(
            @Param('id') id: string,
            @Body() dto: UpdateRecognitionDto
        ) {

        }

     // Delete Badge by ID
        @Delete('recognition-delete/:id')
        async deleteRecognition(@Param('id') id:string){
            return await this.updateAndDeleteReconitionService.deleteRecognition(id)
        }
}
