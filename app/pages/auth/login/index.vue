<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import * as v from 'valibot';

const schema = v.object({
    email: v.pipe(v.string(), v.email('Invalid email')),
    password: v.pipe(v.string(), v.nonEmpty('Password cannot be empty')),
})

type Schema = v.InferOutput<typeof schema>

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    console.log(event.data)
}


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
                                <UInput label="Email address" class="w-full" placeholder="Enter your email" v-model="state.email" />
                            </UFormField>

                            <UFormField type="password" name="password" label="Password" class="w-full">
                                <UInput label="Password" class="w-full" placeholder="Enter your password" type="password"
                                    v-model="state.password" />
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