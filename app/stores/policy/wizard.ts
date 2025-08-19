import type { StepperItem } from "@nuxt/ui";

export const useWizardStore = defineStore('wizard', () => {
    const stepper = useTemplateRef('stepper');

    const drawers = {
        currentCustomer: ref(false),
        newCustomer: ref(false),
    }

    const primaryPolicyholderId = ref(null as string | null);

    const steps = [
        { title: 'Customer information', slot: 'customer_information' as const, description: 'Enter customer details', icon: 'i-heroicons-user' },
        { title: 'Drivers', slot: 'drivers' as const, description: 'Add driver information', icon: 'i-heroicons-user' },
        { title: 'Vehicles', slot: 'vehicles' as const, description: 'Enter vehicle information', icon: 'i-lucide-car' },
        { title: 'Coverage Options', slot: 'coverage_options', description: 'Select coverage options', icon: 'i-heroicons-shield-check' },
        { title: 'Review & Submit', slot: 'review', description: 'Review and submit the policy', icon: 'i-heroicons-check-circle' }
    ] satisfies StepperItem[];

    const step = ref(0);

    const openDrawer = (name: keyof typeof drawers) => {
        drawers[name].value = true;
    };

    return { stepper, steps, step, primaryPolicyholderId, drawers, openDrawer };
});