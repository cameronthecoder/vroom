export const useDebouncedSearch = async (searchFn: (query: string) => Promise<void>, delay = 300) => {
    const loadersStore = useLoadingStore();
    const error = ref<string | null>(null)
    let debounceTimeout: NodeJS.Timeout | null = null
  
    const debouncedSearch = async (query: string) => {
      // Clear existing timeout
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      
      // Clear previous error
      error.value = null
      
      // If query is empty, don't search
      if (!query.trim()) {
        loadersStore.setLoader('customerLookup', false)
        return
      }
      
      // Set loading state
      loadersStore.setLoader('customerLookup', true)
      
      // Set new timeout for debounced search
      debounceTimeout = setTimeout(async () => {
        try {
          await searchFn(query.trim())
        } catch (err) {
          error.value = err instanceof Error ? err.message : 'An error occurred'
        } finally {
          loadersStore.setLoader('customerLookup', false)
        }
      }, delay)
    }
  
    return { debouncedSearch, error }
  }