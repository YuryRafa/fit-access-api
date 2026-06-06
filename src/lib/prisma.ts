import {env} from '@/env'
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['query'] : []



});