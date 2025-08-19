// services/policyClient.ts
import type { AsyncData } from '#app'
import type {People} from '#shared/types/db' 
import type {FetchError} from 'ofetch'
import type {Selectable} from 'kysely'
type SearchResponse = AsyncData<Selectable<People>[], FetchError | undefined>

export const searchCustomers = async (query: string): Promise<SearchResponse> => {
    return await useFetch<Selectable<People>[]>('/api/customers/search', {
      query: { q: query },
      server: false,
      default: () => ([] as Selectable<People>[])
    })
  }