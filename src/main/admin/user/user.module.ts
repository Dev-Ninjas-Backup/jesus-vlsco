import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AddEducationService } from './services/add-education.service';
import { AddExperienceService } from './services/add-experience.service';
import { AddPayrollService } from './services/add-payroll.service';
import { UserService } from './services/add-profile-info.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AddEducationService, AddExperienceService, AddPayrollService]
})
export class UserModule {}
