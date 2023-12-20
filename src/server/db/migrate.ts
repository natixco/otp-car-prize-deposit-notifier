import 'dotenv/config';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { db } from './db';

await migrate(db, { migrationsFolder: './drizzle' });