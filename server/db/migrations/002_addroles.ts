import type {Kysely} from "kysely";
import {sql} from "kysely";

// Sunday, August 17th - Add roles to users table

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {

    // create users enum type as array

    await db.schema.createType('user_roles').asEnum(['CUSTOMER', 'ADMIN', 'AGENT']).execute();
    await db.schema.alterTable('users').addColumn('roles', sql`user_roles[]`, (col) => col.notNull().defaultTo(sql`'{CUSTOMER}'`)).execute();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function drop(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable('users').dropColumn('roles').execute();
    await db.schema.dropType('user_roles').execute();
}