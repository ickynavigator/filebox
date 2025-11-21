import { createEnv } from '@t3-oss/env-nextjs';
import { vercel } from '@t3-oss/env-nextjs/presets-zod';
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

    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url().default('http://localhost:3000'),

    CRON_SECRET: z.string().default('secret'),

    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  experimental__runtimeEnv: {},
  extends: [vercel()],
});

export default env;
