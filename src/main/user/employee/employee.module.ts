import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { EmployeeController } from './controller/employee.controller';
import { EmployeeService } from './services/employee.service';
import { UpdateUserService } from '@project/main/admin/user/services/update-user.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, CloudinaryService, UpdateUserService],
})
export class EmployeeModule {}
