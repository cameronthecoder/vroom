import type { Addresses, DB, Parties } from '../../shared/types/db';
import type { Kysely, Selectable, Insertable Transaction } from 'kysely';
import type { z } from 'zod';



export class AddressService {
    constructor(private db: Kysely<DB>) {}
    
    async createLink<T>(id: string, address: Selectable<Addresses>, entity: T, trx?: Transaction<DB>): Promise<Selectable<Addresses>> {
        const db = trx ?? this.db;

        switch (typeof entity) {
            case Party: {
                const newAddress = await db.insertInto('party_addresses')
                    .values({
                        party_id: id,
                        address_id: address.id,
                        role: 'MAILING'
                    })
                    .returningAll()
                    .executeTakeFirstOrThrow();

    }

    async createAddress<T>(address: Insertable<Addresses>, entity: T, trx?: Transaction<DB>): Promise<Selectable<Addresses>> {
        const db = trx ?? this.db;

        const newAddress = await db.insertInto('addresses')
            .values({
                ...address
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        
        return newAddress;
}