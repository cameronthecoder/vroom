<script lang="ts" setup>
import type { StepperItem, FormSubmitEvent } from '@nuxt/ui';
import * as v from 'valibot';

const steps = [
    { title: 'Customer information', slot: 'customer_information' as const, description: 'Enter customer details', icon: 'i-heroicons-user' },
    { title: 'Drivers', slot: 'drivers' as const, description: 'Add driver information', icon: 'i-heroicons-user' },
    { title: 'Vehicles', slot: 'vehicles' as const, description: 'Enter vehicle information', icon: 'i-lucide-car' },
    { title: 'Coverage Options', slot: 'coverage_options', description: 'Select coverage options', icon: 'i-heroicons-shield-check' },
    { title: 'Review & Submit', slot: 'review', description: 'Review and submit the policy', icon: 'i-heroicons-check-circle' }
] satisfies StepperItem[];

const schema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(8, 'Must be at least 8 characters'))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  email: '',
  password: ''
});

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}


</script>


<template>
    <div>

        <UCard>
            <UStepper :items="steps" class="w-full">
                <template #customer_information>
                    <div class="p-4">
                        <h2 class="text-lg font-semibold mb-4">Customer Information</h2>
                        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                            <UFormField label="Email" name="email">
                                <UInput v-model="state.email" />
                            </UFormField>

                            <UFormField label="Password" name="password">
                                <UInput v-model="state.password" type="password" />
                            </UFormField>

                            <UButton type="submit">
                                Submit
                            </UButton>
                        </UForm>
                    </div>
                </template>
            </UStepper>
        </Ucard>
    </div>
</template>