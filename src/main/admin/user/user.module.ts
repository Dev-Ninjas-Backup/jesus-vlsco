import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddUserController } from './controller/add-user.controller';
import { AddEducationService } from './services/add-education.service';
import { AddExperienceService } from './services/add-experience.service';
import { AddPayrollService } from './services/add-payroll.service';
import { AddUserService } from './services/add-user.service';

@Module({
  controllers: [AddUserController],
  providers: [
    AddUserService,
    AddEducationService,
    AddExperienceService,
    AddPayrollService,
    CloudinaryService,
  ],
})
export class UserModule {}
