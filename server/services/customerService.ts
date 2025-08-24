import type { DB, People } from '../../shared/types/db';
import type { Kysely, Insertable, Selectable, Transaction } from 'kysely';
import { type Party, PartyService } from './partyService';
import type { z } from 'zod';
import { ADDRESS_LINK_TABLE, type AddressTable, type CustomerResult, type _customerWithAddressSchema, type Address, type Person } from '../../shared/types/queries';
import { AddressService } from './addressService';

export class CustomerService {
    private partyService: PartyService;
    private addressService: AddressService;

    constructor(private db: Kysely<DB>) {
        this.partyService = new PartyService(db);
        this.addressService = new AddressService(db);
    }

    async searchCustomers(query: string): Promise<Selectable<CustomerResult>[]> {
        return await this.db.selectFrom('people')
        .innerJoin('parties', 'people.party_id', 'parties.id')
        .select([
            'parties.id as party_id',
            'parties.name',
            'parties.display_name',
            'people.first_name',
            'people.last_name',
            'people.phone',
            'people.license_number',
            'people.license_state'
        ])
        .where((eb) => 
            eb.or([
                eb('people.first_name', 'ilike', `%${query}%`),
                eb('people.last_name', 'ilike', `%${query}%`),
                eb('parties.name', 'ilike', `%${query}%`),
                eb('people.license_number', '=', query)
            ])
        )
        .orderBy('parties.display_name', 'asc')
        .execute();
    }

    static toCustomerResult(person: Selectable<People>, party: Selectable<Party>): CustomerResult {
        return {
            party_id: party.id,
            name: party.name,
            display_name: party.display_name,
            first_name: person.first_name,
            last_name: person.last_name,
            phone: person.phone,
            license_number: person.license_number,
            license_state: person.license_state
        };
    }

    async createPersonForParty(partyId: string, customer: z.infer<typeof _customerWithAddressSchema>, trx?: Transaction<DB>): Promise<Selectable<DB['people']>> {
        const db = trx ?? this.db;
        const newPerson = await db.insertInto('people').values({
            party_id: partyId,
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone: customer.phone,
            license_number: customer.license_number,
            license_state: customer.license_state,
        }).returningAll().executeTakeFirstOrThrow();

        return newPerson;
    }

    async createCustomerWithParty(customer: z.infer<typeof _customerWithAddressSchema> & {address: Insertable<Addresses>}): Promise<Selectable<CustomerResult>> {
        return await this.db.transaction().execute(async (tx) => {
            const party: Party = await this.partyService.createPartyFromCustomer(customer, tx);
            const person: Person = await this.createPersonForParty(party.id, customer, tx);
            const address: Address = await this.addressService.createAddress(customer.address, tx);
            const _link: AddressTable = await this.addressService.createLink(party.id, address, ADDRESS_LINK_TABLE.PARTY_ADDRESSES, tx);
            return CustomerService.toCustomerResult(person, party);
        });
    }
}