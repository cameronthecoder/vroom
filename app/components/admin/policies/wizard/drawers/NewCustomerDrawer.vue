<script lang="ts" setup>
import { useWizardStore } from '~/stores/policy/wizard';
import { newCustomerSchema, US_STATE, addressesTableSchema, addressStatusSchema } from '#imports';
import type z from 'zod';
import { createPartyWithCustomer } from '~/services/customerClientService';
const wizardStore = useWizardStore();


const _constumerWithAddressSchema = newCustomerSchema.extend({
  address: addressesTableSchema
});




type NewCustomerSchemaType = z.output<typeof _constumerWithAddressSchema>;

const items = US_STATE.options.map((item) => ({
  label: item,
  value: item,
  parsed: US_STATE.parse(item),
}));

const state_items = US_STATE.options.map((item) => ({
  label: item.toString(),
  value: item.toString(),
}));

console.log(items);


const state = reactive<NewCustomerSchemaType>({
  first_name: '',
  last_name: '',
  phone: '',
  license_number: '',
  license_state: US_STATE.parse('AL'), // Default to Alabama
  address: {
    line1: '',
    line2: '',
    status: addressStatusSchema.enum.ACTIVE,
    country: '',
    city: '',
    state: 'AL', // Default to Alabama
    postal_code: '',
    created_at: new Date(),
    updated_at: new Date(),
    latitude: null,
    longitude: null,
    id: ''
  }
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

  <UDrawer :ui="{ content: 'w-full', container: 'max-w-xl' }" v-model:open="wizardStore.drawers.newCustomer"
    title="New Customer" >
    <template #content>
      <p>{{ state }}</p>
      <p class="text-3xl font-bold my-5 text-center">Create a new customer</p>
      <UForm :schema="newCustomerSchema" :state="state" class="p-10 overflow-auto h-full" @submit="submitForm()">
        <h1 class="text-2xl font-bold mb-5">Customer Information</h1>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-10">
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

        <h1 class="text-2xl font-bold mb-5 mt-5">Address Information</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <UFormField label="Line 1" name="line_1">
          <UInput v-model="state.address.line1" size="lg" type="text" class="w-full" />
        </UFormField>

        <UFormField label="Line 2" name="line_2">
          <UInput v-model="state.address.line2" size="lg" type="text" class="w-full" />
        </UFormField>

        <UFormField label="City" name="city">
          <UInput v-model="state.address.city" size="lg" type="text" class="w-full" />
        </UFormField>

        <UFormField label="State" name="address_state">
          <USelectMenu
            v-model="state.address.state" :search-input="{
            placeholder: 'Filter...',
            icon: 'i-lucide-search'
          }" :items="state_items" size="xl" value-key="value" placeholder="Select a state" class="w-full" />
        </UFormField>

        <UFormField label="Postal Code" name="postal_code">
          <UInput v-model="state.address.postal_code" size="lg" type="number" class="w-full" />
        </UFormField>


        </div>
        

        <UButton :loading="loadersStore.loaders.newCustomer" type="submit" size="xl" class="mt-10 w-full flex items-center justify-center" >
          Create
        </UButton>
      </UForm>
    </template>
  </UDrawer>

</template>