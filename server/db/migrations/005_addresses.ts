import type {Kysely} from "kysely";
import {sql} from "kysely";

// Thursday, August 21st - Add addresses table and related tables

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {

    await db.schema.createType('address_role').asEnum(['MAILING', 'BILLING', 'PHYSICAL', 'GARAGING', 'CLAIM_SCENE', 'TOW_YARD', 'REPAIR_SHOP', 'OTHER']).execute();

    await db.schema.createType('address_status').asEnum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).execute();

    await db.schema
        .createTable('addresses')
        .addColumn('id', 'uuid', (col) => col.notNull().primaryKey())
        .addColumn('line1', 'text', (col) => col.notNull())
        .addColumn('line2', 'text')
        .addColumn('status', sql`address_status`, (col) => col.notNull().defaultTo('ACTIVE'))
        .addColumn('city', 'text', (col) => col.notNull())
        .addColumn('state', 'char(2)', (col) => col.notNull())
        .addColumn('postal_code', 'text', (col) => col.notNull())
        .addColumn('country', 'text', (col) => col.notNull().defaultTo('US'))
        .addColumn('latitude', 'numeric(9, 6)')
        .addColumn('longitude', 'numeric(9, 6)')
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .execute();

        await db.schema.createIndex('idx_addresses_city_state')
        .on('addresses')
        .column('city')
        .column('state')
        .execute();

    await db.schema.createIndex('idx_addresses_postal_code')
        .on('addresses')
        .column('postal_code')
        .execute();

    await db.schema.createTable('policy_addresses')
        .addColumn('policy_id', 'uuid', (col) => col.notNull().references('policies.id').onDelete('cascade'))
        .addColumn('address_id', 'uuid', (col) => col.notNull().references('addresses.id').onDelete('restrict'))
        .addColumn('role', sql`address_role`, (col) => col.notNull().defaultTo('MAILING'))
        .addColumn('effective_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('expires_at', 'timestamptz' , (col) => col.notNull().defaultTo('infinity'))

        .execute();
    

    await db.schema.createTable('claim_addresses')
        .addColumn('claim_id', 'uuid', (col) => col.notNull().references('claims.id').onDelete('cascade'))
        .addColumn('address_id', 'uuid', (col) => col.notNull().references('addresses.id').onDelete('restrict'))
        .addColumn('role', sql`address_role`, (col) => col.notNull().defaultTo('CLAIM_SCENE'))
        .addColumn('effective_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('expires_at', 'timestamptz', (col) => col.notNull().defaultTo('infinity'))
        .execute();

    await db.schema.createTable('party_addresses')
        .addColumn('party_id', 'uuid', (col) => col.notNull().references('parties.id').onDelete('cascade'))
        .addColumn('address_id', 'uuid', (col) => col.notNull().references('addresses.id').onDelete('restrict'))
        .addColumn('role', sql`address_role`, (col) => col.notNull().defaultTo('CLAIM_SCENE'))
        .addColumn('effective_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('expires_at', 'timestamptz', (col) => col.notNull().defaultTo('infinity'))
        .execute();

    await db.schema.createTable('vehicle_addresses')
        .addColumn('vehicle_id', 'uuid', (col) => col.notNull().references('vehicles.id').onDelete('cascade'))
        .addColumn('address_id', 'uuid', (col) => col.notNull().references('addresses.id').onDelete('restrict'))
        .addColumn('role', sql`address_role`, (col) => col.notNull().defaultTo('CLAIM_SCENE'))
        .addColumn('effective_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .addColumn('expires_at', 'timestamptz', (col) => col.notNull().defaultTo('infinity'))
        .execute();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function drop(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('vehicle_addresses').execute();
    await db.schema.dropTable('party_addresses').execute();
    await db.schema.dropTable('claim_addresses').execute();
    await db.schema.dropTable('policy_addresses').execute();
    await db.schema.dropTable('addresses').execute();

    await db.schema.dropType('address_role').execute();
    await db.schema.dropType('address_status').execute();
}