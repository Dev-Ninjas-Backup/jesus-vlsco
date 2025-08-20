import { Controller } from '@nestjs/common';
import { UserTimeClickService } from './user-time-click.service';

@Controller('user-time-click')
export class UserTimeClickController {
  constructor(private readonly userTimeClickService: UserTimeClickService) {}
}
