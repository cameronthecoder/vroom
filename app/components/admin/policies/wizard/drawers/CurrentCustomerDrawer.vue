<script lang="ts" setup> 
import { useWizardStore } from '~/stores/policy/wizard';
import { useDebouncedSearch } from '#imports';
import { searchCustomers } from '~/services/customerClientService';
import type {Selectable} from 'kysely'
const wizardStore = useWizardStore();

const searchTerm = ref('');
const results = ref<Selectable<People[]>>([]);

const callAPI = async (query: string): Promise<void> => {
    await searchCustomers(query)
        .then((response) => {
            if (results.value) {
                results.value = response.data.value as unknown as People[];
            }
            console.log('Search results:', results.value);
        })
        .catch((error) => {
            console.error('Error fetching search results:', error);
        });
}
const { debouncedSearch } = await useDebouncedSearch(callAPI, 300)
watch (searchTerm, (newQuery) => {
    if (!newQuery.trim()) {
        results.value = []
  }
  debouncedSearch(newQuery)
  console.log('Search term changed:', newQuery);
});

</script>
<template>

<UDrawer v-model:open="wizardStore.drawers.currentCustomer">
    <template #content>
        <UCommandPalette
        v-model:search-term="searchTerm"
        :loading="false"
        :groups="[]"
        placeholder="Search customers..."
        class="h-80"
      />
    </template>
  </UDrawer>

</template>