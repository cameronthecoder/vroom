import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "../../shared/types/db";

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL
    }),
  }),
  // log: ['query', 'error'], // Enable query and error logging
});

