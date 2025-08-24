import type { Insertable, Selectable } from "kysely";
import type { Addresses, ClaimAddresses, Parties, PartyAddresses, People, PolicyParties, VehicleAddresses } from "./db";
import {addressesTableSchema} from "./zod2";
import { newCustomerSchema } from "./zod";
export type AddressTable = Selectable<ClaimAddresses | VehicleAddresses | PartyAddresses>;

export const _customerWithAddressSchema = newCustomerSchema.extend({
  address: addressesTableSchema
});


export const enum ADDRESS_LINK_TABLE {
  CLAIM_ADDRESSES = 'claim_addresses',
  VEHICLE_ADDRESSES = 'vehicle_addresses',
  PARTY_ADDRESSES = 'party_addresses'
}

export type PersonParty = Selectable<People & Parties & PolicyParties>;
export type Person = Selectable<People>
export type Address = Selectable<Addresses>
export interface CustomerResult {
    party_id: string
    name: string
    display_name: string
    first_name: string
    last_name: string
    phone: string | null
    license_number: string | null
    license_state: string
  }

