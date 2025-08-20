import type { AsyncData } from '#app'
import type { FetchError } from 'ofetch'
import type { Selectable } from 'kysely'
import type {z} from 'zod'
import type { CustomerResult } from '~~/shared/types/queries'
type SearchResponse = AsyncData<Selectable<CustomerResult>[], FetchError | undefined>

export const searchCustomers = async (query: string): Promise<SearchResponse> => {
  return await useFetch<Selectable<CustomerResult>[]>('/api/customers/search', {
    query: { q: query },
    server: false,
    default: () => ([] as Selectable<CustomerResult>[])
  })
}

export const createPartyWithCustomer = async (customer: z.infer<typeof newCustomerSchema>): Promise<AsyncData<CustomerResult, FetchError | undefined>> => {
  console.log(customer);
  
  return await useFetch<Selectable<CustomerResult>>('/api/customers', {
    method: 'POST',
    body: {...customer, license_state: US_STATE.parse(customer.license_state)},
    server: false,
    default: () => ({} as Selectable<CustomerResult>)
  })
}