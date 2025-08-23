import { CustomerService } from "~~/server/services/customerService";
import { db } from '../../db/db';
const customerWithAddressSchema = newCustomerSchema.extend({
    address: addressesTableSchema
  });
const customerService = new CustomerService(db);

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, customerWithAddressSchema.parse);
    console.log(body);
    const party = await customerService.createCustomerWithParty(body);
    return party;
});