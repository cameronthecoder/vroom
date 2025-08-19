import type { DB, Parties } from '../../shared/types/db';
import type { Kysely, Selectable, Transaction } from 'kysely';
import type { z } from 'zod';

export type Party = Selectable<Parties>;


export class PartyService {
    constructor(private db: Kysely<DB>) {}

    async createPartyFromCustomer(customer: z.infer<typeof newCustomerSchema>, trx?: Transaction<DB>): Promise<Party> {
        const db = trx ?? this.db;
        const party = await db.insertInto('parties').values({
            display_name: customer.first_name + ' ' + customer.last_name,
            name: customer.first_name + ' ' + customer.last_name,
        }).returningAll().executeTakeFirstOrThrow();

        return party;
    }
}