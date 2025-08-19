<script lang="ts" setup> 
import { useWizardStore } from '~/stores/policy/wizard';
import { useDebouncedSearch, type CustomerSearchResult } from '#imports';
import { searchCustomers } from '~/services/customerClientService';
import type { CommandPaletteItem } from '@nuxt/ui';


const wizardStore = useWizardStore();

const results = ref<CommandPaletteItem[] & CustomerSearchResult[]>([]);

const groups = computed(() => [
  {
    id: 'customers',
    label: 'Customers',
    items: results.value
  }
])

const searchTerm = ref('');

const callAPI = async (query: string): Promise<void> => {
    try {
        const response = await searchCustomers(query);
        if (response?.data?.value) {
            results.value = response.data.value.map((customer) => ({
                party_id: customer.party_id,
                label: customer.display_name,
                icon: 'i-lucide-user',
                name: customer.display_name,
                display_name: customer.display_name,
                first_name: customer.first_name,
                last_name: customer.last_name,
                email: customer.email,
                phone: customer.phone,
                license_number: customer.license_number,
                license_state: customer.license_state,
            }));
        } else {
            results.value = [];
        }
        console.log('Search results:', results.value);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
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
        :groups="groups"
        placeholder="Search customers..."
        class="h-80"
      />
    </template>
  </UDrawer>

</template>