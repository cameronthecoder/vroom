<script lang="ts" setup>
import CustomerInformationStep from './steps/CustomerInformationStep.vue';
import { useWizardStore } from '~/stores/policy/wizard';
const wizardStore = useWizardStore();
</script>


<template>
    <div>
        <UCard>
            <UStepper ref="wizardStore.stepper" v-model="wizardStore.step" :items="wizardStore.steps" class="w-full">
                <template #customer_information>
                    <div class="p-4">
                        <CustomerInformationStep />
                    </div>
                </template>
            </UStepper>
        </Ucard>
    </div>
</template>