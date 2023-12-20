import 'dotenv/config';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { db } from './db';

(async () => await migrate(db, { migrationsFolder: './drizzle' }))();