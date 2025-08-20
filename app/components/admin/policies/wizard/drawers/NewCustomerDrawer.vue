<script lang="ts" setup>
import { useWizardStore } from '~/stores/policy/wizard';
import { newCustomerSchema } from '~~/shared/types/zod';
import { US_STATE } from '#imports';
import type z from 'zod';
import { createPartyWithCustomer } from '~/services/customerClientService';
const wizardStore = useWizardStore();

type NewCustomerSchemaType = z.output<typeof newCustomerSchema>;

const items = US_STATE.options.map((item) => ({
  label: item,
  value: item,
  parsed: US_STATE.parse(item),
}));

console.log(items);


const state = reactive<Partial<NewCustomerSchemaType>>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  license_number: '',
  license_state: US_STATE.parse('AL'), // Default to Alabama
});


const loadersStore = useLoadingStore();

const submitForm = async () => {
  loadersStore.setLoader('newCustomer', true);
  await createPartyWithCustomer(state as NewCustomerSchemaType)
  .then((response) => {
    wizardStore.primaryCustomer = response.data.value;
    wizardStore.drawers.newCustomer = false;
  })
  .catch((error) => {
    console.error('Error creating customer:', error);
  })
  .finally(() => {
    loadersStore.setLoader('newCustomer', false);
  });
}

</script>
<template>

  <UDrawer :ui="{ content: 'h-full w-full', container: 'max-w-xl mx-auto h-full' }" v-model:open="wizardStore.drawers.newCustomer"
    title="New Customer" >
    <template #content>
      <p class="text-3xl font-bold my-5 text-center">Create a new customer</p>
      <p>{{ state.license_state }}</p>
      <UForm :schema="newCustomerSchema" :state="state" class="p-10 overflow-auto h-full" @submit="submitForm()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" type="email" class="w-full" size="xl" />
        </UFormField>

        <UFormField label="First Name" name="first_name">
          <UInput v-model="state.first_name" size="xl" type="text" class="w-full" />
        </UFormField>

        <UFormField label="Last Name" name="last_name">
          <UInput v-model="state.last_name" size="xl" type="text" class="w-full" />
        </UFormField>


        <UFormField label="Phone (no dashes)" name="phone">
          <UInput v-model="state.phone" size="xl" type="text" class="w-full" />
        </UFormField>

        <UFormField label="License State" name="license_state">
          <USelectMenu v-model="state.license_state" value-key="parsed" :search-input="{
            placeholder: 'Filter...',
            icon: 'i-lucide-search'
          }" :items="items" size="xl" placeholder="Select a state" class="w-full" />
        </UFormField>

        <UFormField label="License Number" name="license_number">
          <UInput v-model="state.license_number" size="lg" type="text" class="w-full" />
        </UFormField>
        </div>  

        <UButton :loading="loadersStore.loaders.newCustomer" type="submit" size="xl" class="mt-10 w-full flex items-center justify-center" >
          Create
        </UButton>
      </UForm>
    </template>
  </UDrawer>

</template>