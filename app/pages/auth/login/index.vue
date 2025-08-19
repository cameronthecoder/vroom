<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod';

const schema = z.object({
    email: z.email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

type Schema = z.output<typeof schema>;

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        await $fetch('/api/auth/login/', {
            method: 'POST',
            body: event.data

        }).then(async (res) => {
            toast.add({ title: 'Success', description: 'Login successful!', color: 'success' });
            console.log('Login response:', res.message);
            // Redirect to dashboard or another page after successful login
            console.log('Navigating to /admin');
            
            await navigateTo('/admin');
        });
        return;
    } catch (error) {
        toast.add({ title: 'Error', description: 'Login failed. Please check your credentials. \n ' + error, color: 'error' });
        console.error('Login error:', error);
        return;
    }
};

const state = reactive({
    email: '',
    password: ''
});

</script>
<template>
    <div>
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
            <div class="max-w-md w-full space-y-8">
                <h1 class="text-center text-4xl font-extrabold">Vroom! Insurance Portal</h1>
                <UCard>
                    <template #header>
                        <h1 class="text-xl font-bold text-center">Login</h1>
                    </template>
                    <UForm class="space-y-6" :schema="schema" :state="state" @submit="onSubmit">
                        <div class="space-y-4">
                            <UFormField type="email" label="Email" class="w-full" name="email">
                                <UInput label="Email address" class="w-full" placeholder="Enter your email"
                                    v-model="state.email" />
                            </UFormField>

                            <UFormField type="password" name="password" label="Password" class="w-full">
                                <UInput label="Password" class="w-full" placeholder="Enter your password"
                                    type="password" v-model="state.password" />
                            </UFormField>
                        </div>

                        <div class="flex items-center justify-between">
                            <UCheckbox label="Remember me" />
                            <UButton variant="link" size="sm">
                                Forgot your password?
                            </UButton>
                        </div>

                        <UButton type="submit" block size="lg" class="w-full">
                            Sign in
                        </UButton>
                    </UForm>
                </UCard>
            </div>
        </div>
    </div>

</template>