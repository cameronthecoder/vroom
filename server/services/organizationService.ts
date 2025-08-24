import type { DB } from '../../shared/types/db';
import { PartyService } from './partyService';
import { AddressService } from './addressService';
import { Kysely, Selectable, Insertable, Transaction } from 'kysely';


export class OrganizationService {
    private partyService: PartyService;
    private addressService: AddressService;

    constructor(private db: Kysely<DB>) {
        this.partyService = new PartyService(db);
        this.addressService = new AddressService(db);
    }
}