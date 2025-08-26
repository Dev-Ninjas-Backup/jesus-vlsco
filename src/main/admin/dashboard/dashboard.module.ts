import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { LatestPoolSurveyService } from './services/latest-pool-survey.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, LatestPoolSurveyService],
})
export class DashboardModule {}
