// services/policyClient.ts
import type { AsyncData } from '#app'
import type { FetchError } from 'ofetch'
import type { Selectable } from 'kysely'
import type { Party } from '~~/server/services/partyService'
import type {z} from 'zod'
type SearchResponse = AsyncData<Selectable<CustomerSearchResult>[], FetchError | undefined>

export const searchCustomers = async (query: string): Promise<SearchResponse> => {
  return await useFetch<Selectable<CustomerSearchResult>[]>('/api/customers/search', {
    query: { q: query },
    server: false,
    default: () => ([] as Selectable<CustomerSearchResult>[])
  })
}

export const createPartyWithCustomer = async (customer: z.infer<typeof newCustomerSchema>): Promise<AsyncData<Selectable<Party>, FetchError | undefined>> => {
  return await useFetch<Selectable<Party>>('/api/customers', {
    method: 'POST',
    body: customer,
    server: false,
    default: () => ({} as Selectable<Party>)
  })
}