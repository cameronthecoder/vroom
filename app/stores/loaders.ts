export const useLoadingStore = defineStore('loaders', () => {
    const loaders = {
        customerLookup: ref(false),
        newCustomer: ref(false)
    }

    const setLoader = (name: keyof typeof loaders, value: boolean) => {
            loaders[name].value = value;
    }

    return { loaders, setLoader };
});