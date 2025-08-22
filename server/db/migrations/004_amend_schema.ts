import {sql, type Kysely} from "kysely";

// Sunday, August 21st - Add organizations table, change claim_party.party_type to use claimant_role enum, and alter coverage_selection.amount_cents to allow null values

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {

    // summary: Add organizations table, change claim_party.party_type to use claimant_role enum, and alter coverage_selection.amount_cents to allow null values

    await db.schema
        .createTable('organizations')
        .addColumn('party_id', 'uuid', (col) => col.notNull().primaryKey().references('parties.id').onDelete('cascade'))
        .addColumn('legal_name', 'varchar(255)', (col) => col.notNull())
        .addColumn('tax_id', 'varchar(50)', (col) => col.unique())
        .addColumn('user_id', 'uuid', (col) => col.references('users.id').onDelete('cascade'))
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .execute();

    // 2. alter claim_parties table to change party_type column to use claimant_role enum
    await db.schema
        .alterTable('claim_party')
        .alterColumn('party_type', (col) => col.setDataType(sql`claimant_role USING party_type::claimant_role`))
        .execute();

    await db.schema
        .alterTable('coverage_selection')
        .alterColumn('amount_cents', (col) => col.dropNotNull()) 
        .execute();

    await db.schema
        .alterTable('people')
        .dropConstraint('people_email_key')
        .execute();

    await db.schema
        .alterTable('people')
        .dropColumn('email')
        .execute();


};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function drop(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('people')
        .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
        .execute();

    await db.schema
        .alterTable('coverage_selection')
        .alterColumn('amount_cents', (col) => col.setDataType('bigint'))
        .alterColumn('amount_cents', (col) => col.setNotNull())
        .execute();

    await db.schema
        .alterTable('claim_party')
        .alterColumn('party_type', (col) => col.setDataType('varchar(50)'))
        .execute();

    await db.schema.dropTable('organizations').execute();
}