import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddUserController } from './controller/add-user.controller';
import { EducationService } from './services/education.service';
import { AddExperienceService } from './services/add-experience.service';
import { AddPayrollService } from './services/add-payroll.service';
import { AddUserService } from './services/add-user.service';
import { GetUserService } from './services/get-user.service';
import { GetUserController } from './controller/get-user.controller';
import { EducationController } from './controller/education.controller';

@Module({
  controllers: [AddUserController, GetUserController, EducationController],
  providers: [
    AddUserService,
    EducationService,
    AddExperienceService,
    AddPayrollService,
    CloudinaryService,
    GetUserService,
  ],
})
export class UserModule {}
