import { PartialType } from "@nestjs/swagger";
import { AddRecognitionDto } from "./add-recognition.dto";

export class UpdateRecognitionDto extends PartialType(AddRecognitionDto) {}