<script lang="ts" setup>
import PolicyWizard from '~/components/admin/policies/wizard/PolicyWizard.vue'
import { useWizardStore } from '~/stores/policy/wizard';
const wizardStore = useWizardStore();

definePageMeta({ layout: 'admin' })
</script>


<template>
    <div>
        <h1 v-if="!wizardStore.currentPolicy" class="text-2xl font-bold mb-4" >New Policy</h1>
        <h1 v-else class="text-2xl font-bold mb-4" >New Policy: {{ wizardStore.primaryCustomer?.last_name.toUpperCase() }}, {{ wizardStore.primaryCustomer?.first_name.toUpperCase() }} - #{{ wizardStore.currentPolicy.policy_number }}</h1>

        <PolicyWizard />
    </div>
</template>