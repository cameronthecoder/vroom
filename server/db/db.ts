import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "../../shared/types/db";
import dotenv from 'dotenv';

const _env = dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;



export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: DATABASE_URL
    }),
  }),
  // log: ['query', 'error'], // Enable query and error logging
});

