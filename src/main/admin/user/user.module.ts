import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddUserController } from './controller/add-user.controller';
import { EducationController } from './controller/education.controller';
import { ExperienceController } from './controller/experience.controller';
import { GetUserController } from './controller/get-user.controller';
import { PayrollController } from './controller/payroll.controller';
import { UpdateUserController } from './controller/update-user.controller';
import { AddPayrollService } from './services/add-payroll.service';
import { AddUserService } from './services/add-user.service';
import { EducationService } from './services/education.service';
import { ExperienceService } from './services/experience.service';
import { GetUserService } from './services/get-user.service';
import { PayrollService } from './services/payroll.service';
import { UpdateUserService } from './services/update-user.service';

@Module({
  controllers: [
    AddUserController,
    UpdateUserController,
    GetUserController,
    EducationController,
    ExperienceController,
    PayrollController,
  ],
  providers: [
    AddUserService,
    UpdateUserService,
    EducationService,
    ExperienceService,
    AddPayrollService,
    CloudinaryService,
    GetUserService,
    PayrollService,
  ],
})
export class UserModule {}
