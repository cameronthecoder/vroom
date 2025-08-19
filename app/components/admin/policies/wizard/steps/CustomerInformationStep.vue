<script lang="ts" setup>
import { useWizardStore } from '~/stores/policy/wizard';
import CurrentCustomerDrawer from '../drawers/CurrentCustomerDrawer.vue';
import NewCustomerDrawer from '../drawers/NewCustomerDrawer.vue';
const wizardStore = useWizardStore();

</script>
<template>
    <div v-if="!wizardStore.primaryParty">
    <p class="text-3xl font-bold my-5 text-center">Please select or create a customer</p>
    <p class="text-lg my-5 text-center text-gray-600">This person will be designated the policholder.</p>
    <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4">
        <UButton class="col-span-1 p-5 flex items-center justify-center" variant="solid" size="xl" icon="i-lucide-plus" @click="wizardStore.openDrawer('newCustomer')">
            New Customer
        </UButton>
        <USeparator orientation="vertical" class="hidden md:block" />
        <UButton class="col-span-1 p-5 flex items-center justify-center" variant="solid" size="xl" icon="i-lucide-user" @click="wizardStore.openDrawer('currentCustomer')">
            Current Customer    
        </UButton>
    </div>
    <CurrentCustomerDrawer />
    <NewCustomerDrawer />
    </div>
    <div v-else>
        <!-- show policyholder -->
        <UCard>
            <template #header>
                <h1 class="text-2xl font-bold">Policyholder Primary Party</h1>
            </template>
                <p class="text-lg">You have selected {{ wizardStore.primaryParty?.display_name }} as the policyholder.</p>
            
        </UCard>
    </div>
</template>