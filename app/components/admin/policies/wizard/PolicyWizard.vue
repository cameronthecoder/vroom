<script lang="ts" setup>
import CustomerInformationStep from './steps/CustomerInformationStep.vue';
import { useWizardStore } from '~/stores/policy/wizard';
const wizardStore = useWizardStore();


const stepper = useTemplateRef('stepper');

const toast = useToast();

const conditions: Array<() => boolean> = [
    // Step 0 condition
    () => wizardStore.primaryCustomer !== null,
    // Step 1 condition
    () => (1 + 1) === 2, // Placeholder for actual condition
    // Step 2 condition
    () => (1 + 1) ==  2,
]

const canProceed = computed(() => {
  return conditions[wizardStore.step]?.() ?? false
})

const nextStep = () => {
    if (canProceed.value) {
        stepper.value?.next();
    } else {
        toast.add({
            title: 'Cannot proceed',
            description: 'Please fill out the required fields before proceeding.',
            color: 'warning',
        });
    }
}

const black = () => {
    stepper.value?.prev();
}

</script>


<template>
    <div>
        <UCard>
            <UStepper ref="stepper"  v-model="wizardStore.step" :items="wizardStore.steps">
                <template #customer_information>
                    <div>
                        <CustomerInformationStep />
                    </div>
                </template>

                <template #drivers>
                    <h3 class="text-2xl font-bold">Drivers</h3>
                </template>
            </UStepper>

            <template #footer>
                <div class="flex gap-5 justify-end">
                    <UButton variant="outline" size="xl" class="mt-5 p-5" :disabled="wizardStore.step == 0" @click="black()">
                    Back
                </UButton>
                <UButton variant="solid"  size="xl" color="primary" class="p-5 mt-5" @click="nextStep()">
                    Next Step
                </UButton>
                </div>
            </template>
        </Ucard>
    </div>
</template>