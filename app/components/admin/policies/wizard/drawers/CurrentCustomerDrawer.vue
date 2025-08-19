<script lang="ts" setup> 
import { useWizardStore } from '~/stores/policy/wizard';
import { useDebouncedSearch } from '#imports';
import { searchCustomers } from '~/services/customerClientService';

const wizardStore = useWizardStore();

const searchTerm = ref('');
const results = ref<People[]>([]);

const callAPI = async (query: string): Promise<void> => {
    await searchCustomers(query)
        .then((response) => {
            results.value = response.data ?? [];
            console.log('Search results:', results.value);
        })
        .catch((error) => {
            console.error('Error fetching search results:', error);
        });
}

watch (searchTerm, (newQuery) => {
    if (!newQuery.trim()) {
        results.value = []
  }
  useDebouncedSearch(callAPI, 300);
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