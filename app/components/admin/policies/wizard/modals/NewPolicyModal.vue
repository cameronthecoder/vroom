<script lang="ts" setup>
import { createPolicy } from '~/services/policyClientService';
import { useWizardStore } from '~/stores/policy/wizard';
import { US_STATE } from '#shared/types/zod';


const wizardStore = useWizardStore();
const loadersStore = useLoadingStore(); 
const toast = useToast();

const createNewPolicy = async () => {
  loadersStore.setLoader('newPolicy', true);
  
  const licenseState = wizardStore.primaryCustomer?.license_state;
  if (!licenseState) {
    console.error('License state is required');
    return;
  }
  
  await createPolicy({
      party_id: wizardStore.primaryCustomer?.party_id as string,
      state: US_STATE.parse(licenseState),
      status: 'PENDING',
      currency: 'USD',
      effective_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
  })
  .then((response) => {
    wizardStore.currentPolicy = response.data.value;
    wizardStore.step++;
  })
  .catch((error) => {
    console.error('Error creating customer:', error);
    toast.add({
      title: 'Error creating policy',
      description: error.message || 'An unexpected error occurred while creating the policy.',
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    });
  })
  .finally(() => {
    loadersStore.setLoader('newPolicy', false);
  });
}


</script>

<template>
    <UModal title="Confirm Policy Creation" :close="false" v-model:open="wizardStore.modals.newPolicyCreation">
    <template #body>
      <p class="text-sm">You are about to create a new policy for <span class="font-bold">{{ wizardStore.primaryCustomer?.first_name.toUpperCase() }} {{ wizardStore.primaryCustomer?.last_name.toUpperCase() }}</span> for a <span class="font-bold">six-month (6)</span> term. {{ wizardStore.primaryCustomer?.first_name }} will be the designated policyholder.  Are you sure you want to do this?</p>
    </template>

    <template #footer>
        <div class="flex gap-3 items-center justify-end w-full">
      <UButton variant="outline" size="lg" color="warning" @click="wizardStore.modals.newPolicyCreation = false">
        Cancel
      </UButton>
      <UButton variant="solid" size="lg" color="primary" :loading="loadersStore.loaders.newPolicy" @click="createNewPolicy()">
        Confirm
      </UButton>
    </div>
      </template>
  </UModal>
</template>