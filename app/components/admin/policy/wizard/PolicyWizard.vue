<script lang="ts" setup>
const steps = [
    { title: 'Customer information', description: 'Enter customer details', icon: 'i-heroicons-user' },
    { title: 'Drivers', description: 'Add driver information', icon: 'i-heroicons-user' },
    { title: 'Vehicles', description: 'Enter vehicle information', icon: 'i-lucide-car' },
    { title: 'Coverage Options', description: 'Select coverage options', icon: 'i-heroicons-shield-check' },
    { title: 'Review & Submit', description: 'Review and submit the policy', icon: 'i-heroicons-check-circle' }
]

</script>


<template>
    <div>

        <UCard>
        <UStepper :items="steps" class="w-full"></UStepper>
        </Ucard> 
    </div>
</template>