import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { CreateRecognitionLikeDto } from '@project/main/admin/recognition/dto/recognition.dto';
import { CreateUpdateCommentsService } from '@project/main/admin/recognition/services/create-update-comments.service';
import { GetRecognitionFeed } from './dto/get-feed.dto';
import { RecognitionService } from './recognition.service';

@ApiTags('Employee -- Recognition')
@Controller('employee/recognition')
@ValidateEmployee()
@ApiBearerAuth()
export class RecognitionController {
  constructor(
    private readonly recognitionService: RecognitionService,
    private readonly createUpdateCommentsService: CreateUpdateCommentsService,
  ) {}

  @Get('feed')
  async getRecognitionFeed(
    @GetUser('userId') userId: string,
    @Query() dto: GetRecognitionFeed,
  ) {
    return this.recognitionService.getRecognitionFeed(userId, dto);
  }

  @Post(':recognitionId')
  async create(
    @Param('recognitionId') recognitionId: string,
    @GetUser('userId') userId: string,
    @Body() body: CreateRecognitionLikeDto,
  ) {
    return this.createUpdateCommentsService.createOrUpdate({
      recognitionId,
      userId,
      comment: body.comment,
      reaction: body.reaction,
      commentId: body.commentId,
      parentCommentId: body.parentCommentId,
    });
  }

  // @Get('list/:recognitionId')
  // async list(@Param('recognitionId') recognitionId: string) {
  //   return this.recognitionLikeCommentService.getThreadedComments(recognitionId);
  // }
}
