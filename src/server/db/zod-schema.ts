import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { deposits } from './db-schema';

const depositsSchema = createSelectSchema(deposits);
export type Deposit = z.infer<typeof depositsSchema>;