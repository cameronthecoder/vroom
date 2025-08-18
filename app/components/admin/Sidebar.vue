<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
    [
        {
            label: 'Dashboard',
            icon: 'i-lucide-home',
            active: true
        },
        {
            label: 'ACCOUNTS',
            type: 'label'
        },
        {
            label: 'Policies',
            icon: 'i-lucide-file',
            to: '/admin/policies',
            active: false,
            defaultOpen: true
        },
        {
            label: 'Claims',
            icon: 'i-lucide-file-text',
            to: '/admin/claims'
        },
        {
            label: 'Customers',
            icon: 'i-lucide-users',
            to: '/admin/customers'
        },
        {
            label: 'Reports',
            icon: 'i-lucide-chart-bar',
            to: '/admin/reports'
        },
        {
            label: 'FINANCE',
            type: 'label'
        },
        {
            label: 'Billing',
            icon: 'i-lucide-credit-card',
            to: '/admin/billing'
        },
        {
            label: 'Settings',
            icon: 'i-lucide-cog',
            to: '/admin/settings'
        }
    ]
])
</script>


<template>
    <div class="p-5">
        <h1 class="text-2xl font-bold mb-5">Vroom!</h1>
        <UButton size="xl" variant="solid" color="primary" class="mb-5" block icon="i-heroicons-plus">New Policy
        </UButton>
        <USeparator orientation="horizontal" size="md" class="mb-5" />
        <UNavigationMenu orientation="vertical" :items="items" :ui='{ link: "p-5" }'
            class="data-[orientation=vertical]:w-48 data-[orientation=vertical]:h-30"></UNavigationMenu>
    </div>
</template>