import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { EmployeeController } from './controller/employee.controller';
import { EmployeeService } from './services/employee.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, CloudinaryService],
})
export class EmployeeModule {}
