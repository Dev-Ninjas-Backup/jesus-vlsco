import { Prisma } from '@prisma/client';

interface QueryParams {
  searchTerm?: string;
  sort?: string;
  limit?: number | string;
  page?: number | string;
  fields?: string;
  [key: string]: any;
}

export class PrismaUserQueryBuilder {
  private where: Prisma.UserWhereInput = {};
  private orderBy: Prisma.UserOrderByWithRelationInput[] = [];
  private take = 10;
  private skip = 0;

  constructor(private readonly query: QueryParams) {}

  search(searchableFields: string[]) {
    const { searchTerm } = this.query;

    if (searchTerm && searchableFields.length) {
      const orConditions = searchableFields.map((field) => {
        if (field === 'employeeID') {
          const parsed = Number(searchTerm);
          if (!isNaN(parsed)) {
            return { [field]: parsed }; // ✅ numeric match
          }
          return null; // skip if input is not a number
        }

        // Handle nested profile fields
        if (field.startsWith('profile.')) {
          const nestedField = field.split('.')[1];
          return {
            profile: {
              [nestedField]: { contains: searchTerm, mode: 'insensitive' },
            },
          };
        }

        return { [field]: { contains: searchTerm, mode: 'insensitive' } };
      });

      this.where.OR = orConditions.filter((cond) => cond !== null);
    }

    return this;
  }

  filter() {
    const excluded = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    const filterKeys = Object.keys(this.query).filter(
      (key) => !excluded.includes(key),
    );

    for (const key of filterKeys) {
      const value = this.query[key];
      (this.where as any)[key] = value;
    }

    return this;
  }

  sort(allowedFields: string[] = ['createdAt']) {
    const sortInput = this.query.sort?.toString() || '-createdAt';
    const fields = sortInput.split(',').map((f) => f.trim());

    for (const field of fields) {
      const direction: 'asc' | 'desc' = field.startsWith('-') ? 'desc' : 'asc';
      const cleanField = field.replace(/^-/, '');

      if (allowedFields.includes(cleanField)) {
        this.orderBy.push({
          [cleanField]: direction,
        } as Prisma.UserOrderByWithRelationInput);
      }
    }

    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    this.take = limit;
    this.skip = (page - 1) * limit;

    return this;
  }

  build() {
    return {
      where: this.where,
      orderBy: (this.orderBy.length
        ? this.orderBy
        : [{ createdAt: 'desc' }]) as Prisma.UserOrderByWithRelationInput[],
      take: this.take,
      skip: this.skip,
    };
  }

  async countTotal(prismaModel: any) {
    const total = await prismaModel.count({ where: this.where });
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    return {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }
}
