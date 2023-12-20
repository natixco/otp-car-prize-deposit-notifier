import 'dotenv/config';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from '@vercel/postgres';
import * as schema from './db-schema';

(async () => {
  const db = drizzle(sql, { schema });
  await migrate(db, { migrationsFolder: './drizzle' })
})();