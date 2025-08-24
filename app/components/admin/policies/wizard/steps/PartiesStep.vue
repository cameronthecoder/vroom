<script lang="ts" setup>
import type { AccordionItem, TableColumn } from '@nuxt/ui';
import { useWizardStore } from '~/stores/policy/wizard';
import type { CustomerResult } from '~~/shared/types/queries';
import EntityPickerDrawer, { type AnyRow, type PaletteRow } from '../drawers/EntityPickerDrawer.vue';
import { searchCustomers } from '~/services/customerClientService';

const wizardStore = useWizardStore();
const toast = useToast();


const selectedCustomer = ref<CustomerResult | null>(null)
const searchCustomersRaw = async (query: string): Promise<AnyRow[]> => {
  const response = await searchCustomers(query)
  return (response?.data?.value ?? []) as AnyRow[]
}

const toCustomerItem = (row: AnyRow): PaletteRow => {
  const customer = row as unknown as CustomerResult & {role: PolicyPartyRole};
  return {
    ...customer, 
    icon: 'i-lucide-user',
    label: `${(customer.last_name ?? '').toUpperCase()}, ${(customer.first_name ?? '').toUpperCase()}`.trim(),
    name: customer.display_name,
    suffix: [customer.license_state, customer.license_number].filter(Boolean).join('-')
  }
}


const items = ref<AccordionItem[]>([
  {
    label: 'People',
    icon: 'i-lucide-user',
    slot: 'people',
  },
  {
    label: 'Organizations',
    icon: 'i-lucide-building',
    slot: 'organizations',
  }
])

const addPartyToPolicy = (value: AnyRow | null) => {
    if (!value) return;
    
    const customer = value as unknown as CustomerResult;

    if (customer.party_id === wizardStore.primaryCustomer?.party_id) {
      toast.add({
        title: 'Already Added',
        description: `${customer.display_name} is already included as the named insured.`,
        color: 'info',
        icon: 'i-lucide-info'
      });
      return;
    } else if (wizardStore.otherParties.people.some(p => p.party_id === customer.party_id)) {
      toast.add({
        title: 'Already Added',
        description: `${customer.display_name} is already included in the policy.`,
        color: 'error',
        icon: 'i-lucide-info'
      });
      return;
    }
    wizardStore.otherParties.people.push({...customer, role: 'NAMED_INSURED'});
  selectedCustomer.value = null; // reset selection
  wizardStore.drawers.currentCustomer = false; // close the drawer
}

const people_columns: TableColumn<CustomerResult>[] = [
  {
    accessorKey: 'first_name',
    header: 'First Name',
    cell: ({ row }) => `${row.getValue('first_name')}`
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
    cell: ({ row }) => `${row.getValue('last_name')}`
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => `${(row.getValue('role') as string).replace('_', ' ').toUpperCase()}`
  },
]
</script>
<template>
    <div class="mx-30 my-5">
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-2">Required Parties Disclosure</h3>
        <p class="text-blue-800 text-sm mb-3">
            In accordance with applicable insurance regulations and policy requirements, all parties with a legal or financial interest in the insured vehicle(s) must be properly identified and added to this policy. This includes, but is not limited to:
        </p>
        <ul class="text-blue-800 text-sm space-y-1 ml-4 mb-3">
            <li>• <strong>Lienholders:</strong> Any financial institution or entity holding a security interest in the vehicle</li>
            <li>• <strong>Lessors:</strong> Leasing companies or entities that own leased vehicles</li>
            <li>• <strong>Additional Insureds:</strong> Parties requiring insurance coverage under contractual agreements</li>
            <li>• <strong>Loss Payees:</strong> Entities entitled to receive claim payments</li>
        </ul>
        <p class="text-blue-800 text-sm">
            <strong>Notice:</strong> Failure to properly identify and include required parties may result in coverage gaps, claim denials, or policy violations. It is the policyholder's responsibility to ensure all applicable parties are disclosed and added to the policy.
        </p>
    </div>

    <p>{{ wizardStore.primaryCustomer?.display_name }} is already included as the named insured.</p>


    <UAccordion :collapsible="false" :items="items">
        <template #people>
            <UTable :data="wizardStore.otherParties.people" :columns="people_columns" class="flex-1" />
            <UButton variant="soft" size="lg" class="mt-3 mb-5" icon="i-lucide-plus" @click="wizardStore.openDrawer('currentCustomer')">
                Add New Party
            </UButton>
        </template>
        <template #organizations>
            <p>Orgs</p>
        </template>
    </UAccordion>

    <EntityPickerDrawer 
        v-model="selectedCustomer"
        v-model:open="wizardStore.drawers.currentCustomer"
        :search="searchCustomersRaw"
        @update:model-value="addPartyToPolicy"
        :to-item="toCustomerItem"
        label="Select Customer"
        placeholder="Search customers…"
        :debounce="300"
        @selected="(c) => console.log('picked:', c)"
    />
    </div>
</template>