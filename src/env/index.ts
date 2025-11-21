import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const env = createEnv({
  server: {
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_BUCKET_NAME: z.string(),
    S3_REGION: z.string().default('auto'),
    S3_BUCKET_URL: z.string().url(),

    PASSWORD: z.string().default('password'),

    DATABASE_URL: z.string(),
    DATABASE_TOKEN: z.string(),

    NEXT_AUTH_SECRET: z.string().default('secret'),

    CRON_SECRET: z.string().default('secret'),

    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  experimental__runtimeEnv: {},
});

export default env;
