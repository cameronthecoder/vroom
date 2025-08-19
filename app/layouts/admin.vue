<script setup lang="ts">
import Sidebar  from '~/components/admin/Sidebar.vue'
import Topbar  from '~/components/admin/Topbar.vue'
const sidebarOpen = ref(false)


</script>

<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-950">
    <!-- Sidebar (desktop) -->


    <!-- Sidebar (mobile) -->
      <Sidebar  />
    

    <!-- Main -->
    <div class="flex-1 flex flex-col">
      <Topbar @toggle-sidebar="sidebarOpen = !sidebarOpen" /> 

      <UContainer class="py-6">
        <NuxtPage />
      </UContainer>
    </div>
  </div>
</template>