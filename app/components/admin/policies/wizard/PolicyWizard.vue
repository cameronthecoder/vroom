<script lang="ts" setup>
import CustomerInformationStep from './steps/CustomerInformationStep.vue';
import PartiesStep from './steps/PartiesStep.vue';
import { useWizardStore } from '~/stores/policy/wizard';
const wizardStore = useWizardStore();


const stepper = useTemplateRef('stepper');

const toast = useToast();

const enum STEP_RESPONSE {
    CAN_PROCEED = 'CAN_PROCEED',
    CANNOT_PROCEED = 'CANNOT_PROCEED',
    ACTION_REQUIRED = 'ACTION_REQUIRED',
    CANNOT_GO_BACK = 'CANNOT_GO_BACK',
}

const enum DIRECTION {
    FORWARD = 'FORWARD',
    BACKWARD = 'BACKWARD',
}

const conditions: Array<(direction: DIRECTION) => STEP_RESPONSE> = [
    // Step 0 condition
    (direction: DIRECTION) => { 
        if (wizardStore.primaryCustomer && wizardStore.currentPolicy === null && direction === DIRECTION.FORWARD) {
            wizardStore.modals.newPolicyCreation = true;
            console.log('Primary customer exists but no current policy, opening modal');
            return STEP_RESPONSE.ACTION_REQUIRED;
        } else if (!wizardStore.primaryCustomer) {
            console.log('No primary customer selected, cannot proceed');
            return STEP_RESPONSE.CANNOT_PROCEED;
        } else {
            return STEP_RESPONSE.CAN_PROCEED;
        }
    },
    // Step 1 condition
    (direction: DIRECTION) => {
        if (wizardStore.currentPolicy && direction == DIRECTION.BACKWARD) {
            toast.add({
                title: 'Cannot go back',
                description: 'This policy has been created for the customer. You can’t go back to customer selection. To make changes, cancel this policy and start again.',
                color: 'warning',
                icon: 'i-lucide-alert-triangle'
            });
            return STEP_RESPONSE.CANNOT_GO_BACK;
        }
        return STEP_RESPONSE.CAN_PROCEED;
    },
    // TODO: Add conditions for other steps
    (_direction: DIRECTION) => STEP_RESPONSE.CAN_PROCEED,
    (_direction: DIRECTION) => STEP_RESPONSE.CAN_PROCEED,
    (_direction: DIRECTION) => STEP_RESPONSE.CAN_PROCEED,

]

const validateCurrentStep = (direction: DIRECTION): STEP_RESPONSE => {
  return conditions[wizardStore.step]?.(direction) || STEP_RESPONSE.CANNOT_PROCEED;
}

// A policy and a primary customer are required to proceed from step 0 to step 2


const nextStep = () => {
    const stepResponse = validateCurrentStep(DIRECTION.FORWARD);
    switch (stepResponse) {
        case STEP_RESPONSE.CAN_PROCEED:
            console.log('Proceeding to next step');
            stepper.value?.next();
            break;
        case STEP_RESPONSE.CANNOT_PROCEED:
            toast.add({
                title: 'Cannot proceed',
                description: 'Please complete the required steps before proceeding.',
                color: 'warning',
                icon: 'i-lucide-alert-triangle'
            });
            break;
        case STEP_RESPONSE.ACTION_REQUIRED:
            console.log('Action required before proceeding');
            break;
        case STEP_RESPONSE.CANNOT_GO_BACK:
            toast.add({
                title: 'Something went wrong',
                description: 'This should not happen. Please contact support.',
                color: 'warning',
                icon: 'i-lucide-alert-triangle'
            });
            break;
        default:
            console.error('Unknown step response');
            break;
    }
}

const back = () => {
    const stepResponse = validateCurrentStep(DIRECTION.BACKWARD);
    console.log(stepResponse);
    
    switch (stepResponse) {
        case STEP_RESPONSE.CAN_PROCEED:
            stepper.value?.prev();
            break;
        case STEP_RESPONSE.CANNOT_GO_BACK:
            break;
        default:
            console.error('Unknown step response');
            break;
    }
}

</script>


<template>
    <div>
        <UCard>
            <UStepper ref="stepper" disabled  v-model="wizardStore.step" :items="wizardStore.steps">
                <template #customer_information>
                    <div>
                        <CustomerInformationStep />
                    </div>
                </template>

                <template #parties>
                    <PartiesStep />
                </template>
            </UStepper>

            <template #footer>
                <div class="flex gap-5 justify-end">
                    <UButton variant="outline" size="xl" class="mt-5 p-5" :disabled="wizardStore.step == 0" @click="back()">
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