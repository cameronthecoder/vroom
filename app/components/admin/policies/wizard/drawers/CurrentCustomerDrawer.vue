<script lang="ts" setup> 
import { useWizardStore } from '~/stores/policy/wizard';
import { useDebouncedSearch, type CustomerResult } from '#imports';
import { searchCustomers } from '~/services/customerClientService';
import type { CommandPaletteItem } from '@nuxt/ui';


const wizardStore = useWizardStore();
const loadersStore = useLoadingStore();
const results = ref<CommandPaletteItem[] & CustomerResult[]>([]);

const groups = computed(() => [
  {
    id: 'customers',
    label: searchTerm.value ? `Customers matching “${searchTerm.value}”...` : 'Users',
    items: results.value,
    ignoreFilter: true
  }
])

const searchTerm = ref('');

const callAPI = async (query: string): Promise<void> => {
    try {
        loadersStore.setLoader('customerLookup', true);
        const response = await searchCustomers(query);
        loadersStore.setLoader('customerLookup', false);
        if (response?.data?.value) {
            results.value = response.data.value.map((customer) => ({
                party_id: customer.party_id,
                label: (customer.last_name.toUpperCase() + ', ' + customer.first_name.toUpperCase()).trim(),
                icon: 'i-lucide-user',
                name: customer.display_name,
                display_name: customer.display_name,
                first_name: customer.first_name,
                last_name: customer.last_name,
                email: customer.email,
                suffix: customer.license_state + '-' + customer.license_number,
                phone: customer.phone,
                license_number: customer.license_number,
                license_state: customer.license_state,
            }));
        } else {
            results.value = [];
        }
        console.log('Search results:', results.value);
    } catch (error) {
      loadersStore.setLoader('customerLookup', false);
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

<UDrawer v-model:open="wizardStore.drawers.currentCustomer" class="md:mx-50" title="Select Customer">
    <template #content>
        <UCommandPalette
        v-model:search-term="searchTerm"
        v-model="wizardStore.primaryCustomer"
        :loading="loadersStore.loaders.customerLookup"
        :groups="groups"
        placeholder="Search customers..."
        class="h-80"
      />
    </template>
  </UDrawer>

</template>