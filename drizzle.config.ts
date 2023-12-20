import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/server/db/db-schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DATABASE!,
    connectionString: process.env.POSTGRES_URL!,
  },
} satisfies Config;