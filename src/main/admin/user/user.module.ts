import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddUserController } from './controller/add-user.controller';
import { EducationController } from './controller/education.controller';
import { ExperienceController } from './controller/experience.controller';
import { GetUserController } from './controller/get-user.controller';
import { AddPayrollService } from './services/add-payroll.service';
import { AddUserService } from './services/add-user.service';
import { EducationService } from './services/education.service';
import { ExperienceService } from './services/experience.service';
import { GetUserService } from './services/get-user.service';

@Module({
  controllers: [
    AddUserController,
    GetUserController,
    EducationController,
    ExperienceController,
  ],
  providers: [
    AddUserService,
    EducationService,
    ExperienceService,
    AddPayrollService,
    CloudinaryService,
    GetUserService,
  ],
})
export class UserModule {}
