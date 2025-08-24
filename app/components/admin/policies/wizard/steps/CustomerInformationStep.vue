<script lang="ts" setup>
import { useWizardStore } from '~/stores/policy/wizard';
import EntityPickerDrawer, { type AnyRow, type PaletteRow} from '../drawers/EntityPickerDrawer.vue'
import NewPolicyModal from '../modals/NewPolicyModal.vue';
import NewCustomerDrawer from '../drawers/NewCustomerDrawer.vue';
import type { TabsItem } from '@nuxt/ui';
import { searchCustomers } from '~/services/customerClientService';
const wizardStore = useWizardStore();


const items = ref<TabsItem[]>([
  {
    label: 'Claims',
    icon: 'i-lucide-file-text',
  },
  {
    label: 'Existing Policies',
    icon: 'i-lucide-file'
  }
]);


/** (A) raw search wrapper: return your domain rows */
const searchCustomersRaw = async (query: string): Promise<AnyRow[]> => {
  const response = await searchCustomers(query)
  // adjust if your client shape differs
  return (response?.data?.value ?? []) as AnyRow[]
}

/** (B) domain -> CommandPaletteItem mapping */
const toCustomerItem = (row: AnyRow): PaletteRow => {
  const c = row as unknown as CustomerResult;
  return {
    ...c, // keep original fields for the consumer
    icon: 'i-lucide-user',
    // label is what CommandPalette renders; tweak to taste
    label: `${(c.last_name ?? '').toUpperCase()}, ${(c.first_name ?? '').toUpperCase()}`.trim(),
    // 'name' is also supported by UCommandPalette, often used in filtering
    name: c.display_name,
    // extra line to help the user disambiguate
    suffix: [c.license_state, c.license_number].filter(Boolean).join('-')
  }
}


</script>
<template>
    <NewPolicyModal />
    <div v-if="!wizardStore.primaryCustomer">
    <p class="text-3xl font-bold my-5 text-center">Please select or create a customer</p>
    <p class="text-lg my-5 text-center text-gray-600">This person will be designated the policyholder.</p>
    <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4">
        <UButton class="col-span-1 p-5 flex items-center justify-center" variant="soft" size="xl" icon="i-lucide-plus" @click="wizardStore.openDrawer('newCustomer')">
            New Customer
        </UButton>
        <USeparator orientation="vertical" class="hidden md:block" />
        <UButton class="col-span-1 p-5 flex items-center justify-center" variant="soft" size="xl" icon="i-lucide-user" @click="wizardStore.openDrawer('currentCustomer')">
            Current Customer    
        </UButton>
    </div>
        <EntityPickerDrawer
            v-model="wizardStore.primaryCustomer"
            v-model:open="wizardStore.drawers.currentCustomer"
            :search="searchCustomersRaw"
            :to-item="toCustomerItem"
            label="Select Customer"
            placeholder="Search customers…"
            :debounce="300"
            @selected="(c) => console.log('picked:', c)"
    />
    <NewCustomerDrawer />
    </div>
    <div v-else>
        <!-- show policyholder -->
        <UCard variant="outline" class="mx-30 my-5">
            <template #header>
                <h2 class="text-2xl font-bold">Parties</h2>
            </template>

            <UAlert
                title="DUPLICATE POLICY WARNING"
                v-if="false"
                color="warning"
                class="mb-5"
                description="This customer already has a pending, unfinished policy. Please complete or cancel that policy before creating a new one."
                icon="i-lucide-alert-triangle"
                :actions="[
                    {
                        label: 'View Policy',
                        color: 'neutral',
                        variant: 'soft'
                    },
                        {
                            label: 'Cancel Policy',
                            color: 'neutral',
                            variant: 'soft'
                        }
                ]"
                />

           

            <div class="space-y-3 mb-3">
                <div>
                    <p class="text-xs tracking-widest font-bold text-primary">NAMED INSURED</p>
                    <p class="text-2xl font-bold">{{ wizardStore.primaryCustomer.last_name.toUpperCase() }}, {{ wizardStore.primaryCustomer.first_name.toUpperCase() }}</p>
                </div>
                    <p class="text-xs text-gray-600 flex gap-3 items-center"><UIcon name="i-lucide-phone" size="15"></UIcon> {{ wizardStore.primaryCustomer.phone }}</p>
                    <p class="text-xs text-gray-600 flex gap-3 items-center"><UIcon name="i-lucide-car-front" size="15"></UIcon>{{ wizardStore.primaryCustomer.license_state }} - {{ wizardStore.primaryCustomer.license_number }}</p>
            </div>

            <USeparator type="dashed" />

            <UTabs size="md" variant="pill" :content="false" :items="items" class="w-full mt-10" />

            <template #footer>
                <UButton variant="soft" size="lg" color="warning" icon="i-lucide-arrow-left" class="mt-5" @click="wizardStore.primaryCustomer = null">
                    Incorrect customer? Select another
                </UButton>
            </template>
        </UCard>
    </div>
</template>