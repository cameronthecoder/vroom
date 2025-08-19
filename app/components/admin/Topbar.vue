<script setup lang="ts">

const emit = defineEmits<{ (e: 'toggleSidebar'): void }>()
const query = ref('')
const {user} = useUserSession();
const userMenu = [
  [{ label: (user.value?.first_name || '' + ' ' + user.value?.last_name), icon: 'i-heroicons-user', }],
  [{ label: 'Profile', icon: 'i-heroicons-user-circle', to: '/admin/profile' }],
  [{ label: 'Sign out', icon: 'i-heroicons-arrow-right-on-rectangle', to: '/' }]
]


</script>

<template>
  <header
    class="h-16 border-b border-gray-200 dark:border-gray-800 gap-3 flex items-center px-4 bg-white/60 dark:bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-white/50">
    <UButton class="md:hidden" icon="i-heroicons-bars-3" variant="ghost" color="neutral"
      @click="emit('toggleSidebar')" />

    <div class="w-full max-w-lg">
      <UInput v-model="query" size="xl" placeholder="Search policies, claims, customers…" class="w-full"
        icon="i-heroicons-magnifying-glass" />
    </div>

    <div class="flex-1" />


    <UDropdownMenu :items="userMenu" :popper="{ placement: 'bottom-end' }">
      <UButton color="neutral" variant="ghost" class="!px-2">
        <UAvatar size="sm" src="https://i.pravatar.cc/100?img=5" :alt="'Agent avatar'" />
      </UButton>
    </UDropdownMenu>
  </header>
</template>
