import { CustomerService } from "~~/server/services/customerService";
import { db } from '../../db/db';

const customerService = new CustomerService(db);

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, newCustomerSchema.parse);
    const party = await customerService.createCustomerWithParty(body);
    return party;
});