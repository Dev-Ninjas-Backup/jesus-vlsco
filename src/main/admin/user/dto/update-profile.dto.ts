import { PartialType } from "@nestjs/mapped-types";
import { AddUserDto } from "./add-user.dto";

export class UpdateProfileDto extends PartialType(AddUserDto) {}