import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { SubmitQuestionAnswerDto } from '../dto/survey-answer.dto';
import { SurveyAnswer } from '@prisma/client';

@Injectable()
export class SurveyAnswerService {
      constructor(
        private readonly prisma: PrismaService,
      ) {}

      async submitQuestionAnswer(userId: string, dto: SubmitQuestionAnswerDto) {
      const { surveyId, questionId, answerText, rate, selectedOptions } = dto;

    return this.prisma.$transaction(async (tx) => {
        // 1. Get or create survey response
        let response = await tx.surveyResponse.findFirst({
        where: { surveyId, userId },
        });

        if (!response) {
        response = await tx.surveyResponse.create({
            data: {
            surveyId,
            userId,
            submittedAt: new Date(), // Optional: update this later
            },
        });
        }

    // 2. Upsert answer (update if already exists)
    const existingAnswer = await tx.surveyAnswer.findFirst({
      where: {
        responseId: response.id,
        questionId,
      },
    });

    let answer: SurveyAnswer;

    if (existingAnswer) {
      answer = await tx.surveyAnswer.update({
        where: { id: existingAnswer.id },
        data: { answerText, rate },
      });

      // Remove old selected options if any
      await tx.surveyAnswerOption.deleteMany({
        where: { answerId: answer.id },
      });
    } else {
      answer = await tx.surveyAnswer.create({
        data: {
          responseId: response.id,
          questionId,
          answerText,
          rate,
        },
      });
    }

    // 3. Add selected options (if any)
    if (selectedOptions?.length) {
      await tx.surveyAnswerOption.createMany({
        data: selectedOptions.map((opt) => ({
          answerId: answer.id,
          optionId: opt.optionId,
        })),
      });
    }

    return { success: true, answerId: answer.id };
  });
}

}
