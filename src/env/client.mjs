import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NEXT_PUBLIC_BUCKET_URL: z.string(),
  },
  runtimeEnv: process.env,
});
