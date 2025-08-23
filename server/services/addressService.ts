import type { Addresses, AddressRole, DB } from '../../shared/types/db';
import type { Kysely, Selectable, Insertable, Transaction } from 'kysely';
import { ADDRESS_LINK_TABLE, type AddressTable } from '~~/shared/types/queries';



export class AddressService {
    constructor(private db: Kysely<DB>) { }

    async createLink(id: string, address: Selectable<Addresses>, table: ADDRESS_LINK_TABLE, trx?: Transaction<DB>, role?: AddressRole): Promise<AddressTable> {
        const db = trx ?? this.db;
        switch (table) {
            case ADDRESS_LINK_TABLE.CLAIM_ADDRESSES:
                return await db.insertInto('claim_addresses')
                    .values({
                        claim_id: id,
                        address_id: address.id,
                        role: role ?? 'CLAIM_SCENE'
                    }).returningAll().executeTakeFirstOrThrow();
                break;
            case ADDRESS_LINK_TABLE.VEHICLE_ADDRESSES:
                return await db.insertInto('vehicle_addresses')
                    .values({
                        vehicle_id: id,
                        address_id: address.id,
                        role: role ?? 'GARAGING'
                    }).returningAll().executeTakeFirstOrThrow();
                break;
            case ADDRESS_LINK_TABLE.PARTY_ADDRESSES:
                return await db.insertInto('party_addresses')
                    .values({
                        party_id: id,
                        address_id: address.id,
                        role: role ?? 'MAILING'
                    }).returningAll().executeTakeFirstOrThrow();
                break;
            default:
                throw new Error(`Invalid address link table: ${table}`);
                break;
        }
    }

    async createAddress(address: Insertable<Addresses>, trx?: Transaction<DB>): Promise<Selectable<Addresses>> {
        const db = trx ?? this.db;
        console.log('Creating address:', address);
    
        const newAddress = await db.insertInto('addresses')
            .values({
                line1: address.line1,
                line2: address.line2,
                city: address.city,
                state: address.state,
                postal_code: address.postal_code,
                country: address.country,
                status: address.status ?? 'ACTIVE'
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        console.log('Created address:', newAddress);

        return newAddress;
    }
}