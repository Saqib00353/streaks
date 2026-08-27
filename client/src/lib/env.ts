import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_API_URL: z.url(),
    VITE_API_VERSION: z.string(),
  },

  runtimeEnv: import.meta.env,
})