import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AddProfileInfoService } from './services/add-profile-info.service';
import { AddEducationService } from './services/add-education.service';
import { AddExperienceService } from './services/add-experience.service';
import { AddPayrollService } from './services/add-payroll.service';

@Module({
  controllers: [UserController],
  providers: [AddProfileInfoService, AddEducationService, AddExperienceService, AddPayrollService]
})
export class UserModule {}
