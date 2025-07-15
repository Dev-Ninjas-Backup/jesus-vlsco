import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AddUserController } from './services/add-user.controller';
import { AddUserService } from './services/add-user.service';

@Module({
  controllers: [UserController, AddUserController],
  providers: [AddUserService]
})
export class UserModule {}
