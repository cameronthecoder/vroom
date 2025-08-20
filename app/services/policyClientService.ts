import type { AsyncData } from '#app'
import type { FetchError } from 'ofetch'
import type { Selectable } from 'kysely'
import type {z} from 'zod'
import type { Policies } from '~~/shared/types/db'
import type { newPolicyWithDefaultsSchema } from '~~/shared/types/zod'
type PolicyResponse = AsyncData<Selectable<Policies>, FetchError | undefined>
type Policy = Selectable<Policies>


export const createPolicy = async (policy: z.infer<typeof newPolicyWithDefaultsSchema>): Promise<PolicyResponse> => {
  return await useFetch<Policy>('/api/policies/', {
    method: 'POST',
    body: policy,
    server: false,
    default: () => ({} as Policy)
  })
}