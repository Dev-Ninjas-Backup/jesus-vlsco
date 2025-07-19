import { PartialType } from '@nestjs/swagger';
import { CreateCompanyWithBranchDto } from './createCompany.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyWithBranchDto) {}
