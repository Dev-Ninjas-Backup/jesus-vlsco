import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject() {}
}
