import { PartialType } from "@nestjs/swagger";
import { AddBadgeDto } from "./add-badge.dto";

export class UpdateBadgeDto extends PartialType(AddBadgeDto) {}