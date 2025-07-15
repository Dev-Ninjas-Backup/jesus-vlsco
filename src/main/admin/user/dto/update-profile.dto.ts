import { PartialType } from '@nestjs/swagger';
import { AddProfileDto } from './add-profile-info.dto';

export class UpdateProfileDto extends PartialType(AddProfileDto) {}
