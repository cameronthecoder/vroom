// services/policyClient.ts
import type {People} from '#shared/types/db' 
import type {Selectable} from 'kysely'
interface SearchResponse {
    data: Ref<Selectable<People[]>>
    pending: Ref<boolean>
    error: Ref<Error>
    refresh: () => Promise<void>
  }

export const searchCustomers = async (query: string): Promise<SearchResponse> => {
  return await useFetch<People[]>('/customers/search', {
    query: { q: query },
    server: false
  })
}