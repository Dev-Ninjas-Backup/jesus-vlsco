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
            return { [field]: parsed }; // ✅ numeric match for employeeID
          }
          return null; // skip if not a number
        }

        if (field === 'phone') {
          //  ensure phone search always string-based
          return {
            [field]: {
              contains: String(searchTerm), // cast to string
              mode: Prisma.QueryMode.insensitive,
            },
          };
        }

        // Handle nested profile fields
        if (field.startsWith('profile.')) {
          const nestedField = field.split('.')[1];
          return {
            profile: {
              [nestedField]: {
                contains: String(searchTerm),
                mode: 'insensitive',
              },
            },
          };
        }

        return {
          [field]: {
            contains: String(searchTerm),
            mode: 'insensitive',
          },
        };
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
      let value = this.query[key];

      // Ensure array if multiple values are passed
      if (Array.isArray(value)) {
        value = value.map((v) => v.toString());
      }

      // Handle department in profile
      if (key === 'department') {
        if (!this.where.profile) this.where.profile = {};
        (this.where.profile as any)['department'] = Array.isArray(value)
          ? { in: value }
          : value;
        continue;
      }

      // Handle other nested fields like profile.gender
      if (key.startsWith('profile.')) {
        const [, nestedKey] = key.split('.');
        if (!this.where.profile) this.where.profile = {};
        (this.where.profile as any)[nestedKey] = Array.isArray(value)
          ? { in: value }
          : value;
        continue;
      }

      // Default filter for top-level fields
      (this.where as any)[key] = Array.isArray(value) ? { in: value } : value;
    }

    return this;
  }

  // sort(allowedFields: string[] = ['createdAt']) {
  //   const sortInput = this.query.sort?.toString() || '-createdAt';
  //   const fields = sortInput.split(',').map((f) => f.trim());

  //   for (const field of fields) {
  //     const direction: 'asc' | 'desc' = field.startsWith('-') ? 'desc' : 'asc';
  //     const cleanField = field.replace(/^-/, '');

  //     if (allowedFields.includes(cleanField)) {
  //       this.orderBy.push({
  //         [cleanField]: direction,
  //       } as Prisma.UserOrderByWithRelationInput);
  //     }
  //   }

  //   return this;
  // }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    this.take = limit;
    this.skip = (page - 1) * limit;

    return this;
  }

  // build() {
  //   return {
  //     where: this.where,
  //     orderBy: (this.orderBy.length
  //       ? this.orderBy
  //       : [{ createdAt: 'desc' }]) as Prisma.UserOrderByWithRelationInput[],
  //     take: this.take,
  //     skip: this.skip,
  //   };
  // }

  sort(
    allowedFields: string[] = [
      'createdAt',
      'email',
      'profile.firstName',
      'profile.lastName',
    ],
  ) {
    const sortInput = this.query.sort?.toString() || '-profile.lastName';
    const fields = sortInput.split(',').map((f) => f.trim());

    for (const field of fields) {
      const direction: 'asc' | 'desc' = field.startsWith('-') ? 'desc' : 'asc';
      const cleanField = field.replace(/^-/, '');

      // only allow listed fields (use dot notation for nested)
      if (!allowedFields.includes(cleanField)) continue;

      // support nested fields like "profile.lastName"
      if (cleanField.includes('.')) {
        const parts = cleanField.split('.'); // e.g. ['profile','lastName']
        // build nested object e.g. { profile: { lastName: 'asc' } }
        let nested: any = direction;
        for (let i = parts.length - 1; i >= 0; i--) {
          nested = { [parts[i]]: nested };
        }
        this.orderBy.push(nested as Prisma.UserOrderByWithRelationInput);
      } else {
        // top-level fields
        this.orderBy.push({
          [cleanField]: direction,
        } as Prisma.UserOrderByWithRelationInput);
      }
    }

    return this;
  }

  build() {
    // If no explicit orderBy was provided, default to alphabetical by first name then last name
    const defaultOrder = [
      { profile: { firstName: 'asc' } },
      { profile: { lastName: 'asc' } },
    ] as Prisma.UserOrderByWithRelationInput[];

    return {
      where: this.where,
      orderBy: (this.orderBy.length
        ? this.orderBy
        : defaultOrder) as Prisma.UserOrderByWithRelationInput[],
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
