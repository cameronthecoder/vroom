import { CustomerService } from "~~/server/services/customerService";
import { db } from '../../db/db';

const customerService = new CustomerService(db);

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    const searchQuery = query.q as string;

    const customers = await customerService.searchCustomers(searchQuery);

    return customers;
});