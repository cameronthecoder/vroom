<script lang="ts" setup>
// Reusable drawer + command palette that searches anything you pass in.
import type { CommandPaletteItem } from '@nuxt/ui'

// If you already use your own debounced composable, keep it:
import { useDebouncedSearch } from '#imports' // your existing composable

export type AnyRow = Record<string, unknown>
export type PaletteRow = CommandPaletteItem & AnyRow

interface Props {
  /** v-model: the *selected* entity (whatever your app uses) */
  modelValue?: AnyRow | null

  /** controls the drawer open state */
  open: boolean

  /** header/title for the drawer */
  label?: string

  /** input placeholder */
  placeholder?: string

  /** raw search fn returning domain rows; component handles mapping to palette items */
  search: (query: string) => Promise<AnyRow[]>

  /** map your domain row -> CommandPaletteItem (+ keep original fields) */
  toItem: (row: AnyRow) => PaletteRow

  /** debounce ms for keystrokes */
  debounce?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: 'Select',
  placeholder: 'Search…',
  debounce: 300
})

const emit = defineEmits<{
  /** v-model update for the selected entity */
  'update:modelValue': [value: AnyRow | null]
  /** v-model update for drawer open state */
  'update:open': [value: boolean]
  /** optional convenience event when something is chosen */
  'selected': [value: AnyRow]
}>()

// mirror the v-model:open prop so <UDrawer v-model:open> works
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

// one place that runs your search + maps rows to palette items
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

// your existing composable, just wrap it around runSearch
const { debouncedSearch } = await useDebouncedSearch(runSearch, props.debounce)

watch(localSearchTerm, q => {
  if (!q.trim()) {
    results.value = []
  }
  debouncedSearch(q)
})

// nice-to-have: when the drawer closes, reset input/results
watch(localOpen, open => {
  if (!open) {
    localSearchTerm.value = ''
    results.value = []
    loading.value = false
  }
})

// when a palette item is chosen, bubble up the *original* object too (we kept fields on it)
const onSelect = (item: AnyRow | null) => {
  emit('update:modelValue', item)
  if (item) emit('selected', item)
  // often you want the drawer to close after choosing:
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
