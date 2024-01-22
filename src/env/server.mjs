import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    AWS_PERSONAL_ACCESS_KEY: z.string(),
    AWS_BUCKET_NAME: z.string(),
    AWS_REGION: z.string(),
    AWS_PERSONAL_SECRET_KEY: z.string(),

    PASSWORD: z.string(),

    DATABASE_PRISMA_URL: z.string(),
    DATABASE_URL_NON_POOLING: z.string(),

    NEXT_AUTH_SECRET: z.string().default('secret'),
  },
  runtimeEnv: process.env,
});
