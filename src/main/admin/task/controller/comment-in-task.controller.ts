import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommentInTaskService } from '../services/comment-in-task.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { AddTaskCommentDto } from '../dto/add-comment-in-task.dto';

@ApiTags('Comment In Task')
@Controller('comment-in-task')
@ApiBearerAuth()
@ValidateAuth()
export class CommentInTaskController {
    constructor(private readonly commentInTaskService: CommentInTaskService) {}

    @Post(':taskId')
    @ApiOperation({ summary: 'Comment in task' })
    async comment(
        @Body() dto:AddTaskCommentDto,
        @Param('taskId') taskId:string,
        @GetUser('userId') userId:string
    ){
        return await this.commentInTaskService.addComment(dto,userId,taskId)
    }
}
