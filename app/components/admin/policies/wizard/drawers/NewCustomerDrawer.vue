<script lang="ts" setup>
import { useWizardStore } from '~/stores/policy/wizard';
import { newCustomerSchema, US_STATE, addressesTableSchema, addressStatusSchema } from '#imports';
import type z from 'zod';
import { faker } from '@faker-js/faker';
import type {FormErrorEvent} from '@nuxt/ui'
import { createPartyWithCustomer } from '~/services/customerClientService';
const wizardStore = useWizardStore();


const _customerWithAddressSchema = newCustomerSchema.extend({
  address: addressesTableSchema.omit({id: true})
});



const toast = useToast();

type NewCustomerSchemaType = z.output<typeof _customerWithAddressSchema>;

const items = US_STATE.options.map((item) => ({
  label: item,
  value: item,
  parsed: US_STATE.parse(item),
}));

const state_items = US_STATE.options.map((item) => ({
  label: item.toString(),
  value: item.toString(),
}));



const state = reactive<Partial<NewCustomerSchemaType>>({
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
    latitude: 0,
    longitude: 0
  }
});

const generateFakeCustomer = () => {
  toast.add({
    title: 'Generating Fake Customer',
    description: 'This will generate a fake customer with random data.',
    color: 'info'
  });
  state.first_name = faker.person.firstName();
  state.last_name = faker.person.lastName();
  state.phone = faker.phone.number({style: 'national'}).replace('(', '').replace(')', '').replace('-', '').replace(' ', '');
  state.license_number = faker.string.numeric(8);
  state.license_state = US_STATE.parse(faker.helpers.arrayElement(US_STATE.options));
  if (state.address) {
  state.address.line1 = faker.location.streetAddress();
  state.address.line2 = faker.location.secondaryAddress();
  state.address.city = faker.location.city();
  state.address.state = state.license_state;
  state.address.postal_code = faker.location.zipCode({format: '#####'});
  }
}


const loadersStore = useLoadingStore();

const submitForm = async () => {
  await createPartyWithCustomer(state as NewCustomerSchemaType)
    .then((resp) => {
      toast.add({
        title: 'Customer Created',
        description: 'The customer has been created successfully.',
        color: 'success'
      });
      wizardStore.primaryCustomer = resp.data.value;
      wizardStore.drawers.newCustomer = false;
    })
    .catch((error) => {
      console.error('Error creating customer:', error);
      toast.add({
        title: 'Error Creating Customer',
        description: error.message || 'An error occurred while creating the customer.',
        color: 'error'
      });
    })
    .finally(() => {
      loadersStore.loaders.newCustomer = false;
    });
}

async function onError(event: FormErrorEvent) {
  console.log('Form error event:', event);
  
  if (event?.errors?.[0]?.id) {
    console.log(event.errors);
    
    alert(event.errors[0])
  }
}

</script>
<template>

  <UDrawer :ui="{ content: 'w-full', container: 'max-w-xl' }"  v-model:open="wizardStore.drawers.newCustomer"
    title="New Customer" >
    <template #content>
      <p class="text-3xl font-bold my-5 text-center">Create a new customer</p>
      <p>{{ state }}</p>
      <UForm :schema="_customerWithAddressSchema" @error="onError" :state="state" class="p-10 overflow-auto h-full" @submit="submitForm">
        <h1 class="text-2xl font-bold mb-5">Customer Information</h1>
        <UButton @click="generateFakeCustomer" size="xl" class="mb-5 w-full flex items-center justify-center">
          Generate Fake Customer
        </UButton>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10" v-if="state.address">
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
        

        <UButton :loading="loadersStore.loaders.newCustomer" variant="link" type="submit" class="mt-10 " >
          Create
        </UButton>
      </UForm>
    </template>
  </UDrawer>

</template>