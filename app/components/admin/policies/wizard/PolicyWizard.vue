<script lang="ts" setup>
import CustomerInformationStep from './steps/CustomerInformationStep.vue';
import { useWizardStore } from '~/stores/policy/wizard';
const wizardStore = useWizardStore();
</script>


<template>
    <div>
        <UCard>
            <UStepper ref="wizardStore.stepper"  v-model="wizardStore.step" :items="wizardStore.steps">
                <template #customer_information>
                    <div>
                        <CustomerInformationStep />
                    </div>
                </template>
            </UStepper>
        </Ucard>
    </div>
</template>