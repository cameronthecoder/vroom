<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const stats = [
  { label: 'Active Policies', value: 1280, icon: 'i-heroicons-document-text' },
  { label: 'Open Claims', value: 23, icon: 'i-heroicons-exclamation-triangle' },
  { label: 'Monthly Premiums', value: '$214k', icon: 'i-heroicons-banknotes' },
  { label: 'Customer NPS', value: 62, icon: 'i-heroicons-face-smile' }
]
</script>

<template>
  <div class="space-y-6">
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard v-for="s in stats" :key="s.label">
        <div class="flex items-center gap-3">
          <UIcon :name="s.icon" class="text-3xl text-primary"  />
          <div>
            <div class="text-sm text-gray-500">{{ s.label }}</div>
            <div class="text-xl font-semibold">{{ s.value }}</div>
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid lg:grid-cols-3 gap-4">
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="font-medium">Recent Claims</div>
        </template>
        <UTable :rows="[
          { id: 'CLM-1029', customer: 'Alex Johnson', type: 'Collision', status: 'Review' },
          { id: 'CLM-1030', customer: 'Jamie Lee', type: 'Comprehensive', status: 'Approved' },
          { id: 'CLM-1031', customer: 'Sam Patel', type: 'Liability', status: 'Docs Needed' }
        ]" :columns="[
          { accessorKey: 'id', header: 'Claim ID' },
          { accessorKey: 'customer', header: 'Customer' },
          { accessorKey: 'type', header: 'Type' },
          { accessorKey: 'status', header: 'Status' }
        ]" /> 
      </UCard>

      <UCard>
        <template #header>
          <div class="font-medium">Tasks</div>
        </template>
        <ul class="space-y-3">
          <li class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <USwitch />
              <span>Verify documents for CLM-1031</span>
            </div>
            <UBadge color="error" variant="soft">Due today</UBadge>
          </li>
          <li class="flex items-center gap-2">
            <USwitch />
            <span>Call back: Jamie Lee</span>
          </li>
          <li class="flex items-center gap-2">
            <USwitch />
            <span>Send renewal reminders</span>
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>