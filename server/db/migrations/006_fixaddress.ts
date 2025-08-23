import {sql, type Kysely} from "kysely";

// Friday, August 22nd - Fix address ID field

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable('addresses')
    .alterColumn('id', (col) => col.setDefault(sql`gen_random_uuid()`))
    .execute();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function drop(_db: Kysely<any>): Promise<void> {
    // No drop operation needed for this migration
    // The default value change is non-destructive and doesn't require a rollback
}