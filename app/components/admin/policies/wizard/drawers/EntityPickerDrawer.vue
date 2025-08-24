<script lang="ts" setup>
import type { CommandPaletteItem } from '@nuxt/ui'
import { useDebouncedSearch } from '#imports' 

export type AnyRow = Record<string, unknown>
export type PaletteRow = CommandPaletteItem & AnyRow

interface Props {
  modelValue?: AnyRow | null
  open: boolean
  label?: string
  placeholder?: string
  search: (query: string) => Promise<AnyRow[]>
  toItem: (row: AnyRow) => PaletteRow
  debounce?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: 'Select',
  placeholder: 'Search…',
  debounce: 300
})

const emit = defineEmits<{
  'update:modelValue': [value: AnyRow | null]
  'update:open': [value: boolean]
  'selected': [value: AnyRow]
}>()

const localOpen = computed({
  get: () => props.open,
  set: v => emit('update:open', v)
})

const localSearchTerm = ref('')
const loading = ref(false)
const results = ref<PaletteRow[]>([])

const groups = computed(() => [
  {
    id: 'entities',
    label: localSearchTerm.value
      ? `Results for “${localSearchTerm.value}”`
      : 'Results',
    items: results.value,
    ignoreFilter: true
  }
])

const runSearch = async (q: string) => {
  if (!q.trim()) {
    results.value = []
    return
  }
  loading.value = true
  try {
    const rows = await props.search(q)
    results.value = (rows ?? []).map(props.toItem)
  } catch (e) {
    console.error('[EntityPickerDrawer] search error:', e)
    results.value = []
  } finally {
    loading.value = false
  }
}

const { debouncedSearch } = await useDebouncedSearch(runSearch, props.debounce)

watch(localSearchTerm, q => {
  if (!q.trim()) {
    results.value = []
  }
  debouncedSearch(q)
})


watch(localOpen, open => {
  if (!open) {
    localSearchTerm.value = ''
    results.value = []
    loading.value = false
  }
})

const onSelect = (item: AnyRow | null) => {
  emit('update:modelValue', item)
  if (item) emit('selected', item)
  localOpen.value = false
}
</script>

<template>
  <UDrawer v-model:open="localOpen" class="md:mx-50" :title="label">
    <template #content>
      <UCommandPalette
        v-model:search-term="localSearchTerm"
        :groups="groups"
        :loading="loading"
        :placeholder="placeholder"
        class="h-80"
        @update:model-value="onSelect"
      />
    </template>
  </UDrawer>
</template>
