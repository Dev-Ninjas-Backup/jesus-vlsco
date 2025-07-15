import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class AddProfileInfoService {
    constructor(private readonly prismaService: PrismaService){}
    
    async addUserAndProfile () {
        
    }
}
