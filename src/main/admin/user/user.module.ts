import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddEducationService } from './services/add-education.service';
import { AddExperienceService } from './services/add-experience.service';
import { AddPayrollService } from './services/add-payroll.service';
import { UserService } from './services/add-profile-info.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    AddEducationService,
    AddExperienceService,
    AddPayrollService,
    CloudinaryService,
  ],
})
export class UserModule {}
