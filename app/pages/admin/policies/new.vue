<script lang="ts" setup>
import PolicyWizard from '~/components/admin/policies/wizard/PolicyWizard.vue'

definePageMeta({ layout: 'admin' })
</script>


<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">New Policy</h1>

        <PolicyWizard />
    </div>
</template>