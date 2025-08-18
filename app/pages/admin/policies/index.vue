<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
definePageMeta({ layout: 'admin' })

const items = [
    { label: 'Accounts', to: '/admin' },
    { label: 'Policies', to: '/admin/policies', active: true }
]


const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

type Policyholder = {
    customerId: string
    name: string
    dateOfBirth: string
    address: {
        street: string
        city: string
        state: string
        zip: string
    }
    contact: {
        email: string
        phone: string
    }
}

// Vehicle coverage
type Coverage = {
    liability: {
        bodilyInjury: number
        propertyDamage: number
    }
    collision?: {
        deductible: number
    }
    comprehensive?: {
        deductible: number
    }
}

// Vehicle
type Vehicle = {
    vehicleId: string
    vin: string
    year: number
    make: string
    model: string
    type: string
    primaryUse: 'personal' | 'commercial'
    coverage: Coverage
}

// Agent
type Agent = {
    agentId: string
    name: string
    email: string
}

// Policy
type Policy = {
    policyId: string
    policyNumber: string
    status: 'active' | 'expired' | 'canceled' | 'pending'
    effectiveDate: string
    expirationDate: string
    premium: {
        monthly: number
        annual: number
        currency: string
    }
    policyholder: Policyholder
    vehicles: Vehicle[]
    agents: Agent[]
    createdAt: string
    updatedAt: string
}

const data = ref<Policy[]>([
    {
        policyId: "POL-2025-00123",
        policyNumber: "MN-INS-123456",
        status: "active",
        effectiveDate: "2025-01-01",
        expirationDate: "2026-01-01",
        premium: {
            monthly: 178.50,
            annual: 2142.00,
            currency: "USD"
        },
        policyholder: {
            customerId: "CUST-001",
            name: "Jane Doe",
            dateOfBirth: "1985-04-15",
            address: {
                street: "123 Main St",
                city: "St. Paul",
                state: "MN",
                zip: "55101"
            },
            contact: {
                email: "jane.doe@example.com",
                phone: "+1-651-555-0199"
            }
        },
        vehicles: [
            {
                vehicleId: "VEH-0001",
                vin: "1HGCM82633A123456",
                year: 2021,
                make: "TOYT",
                model: "COROLLA",
                type: "Sedan",
                primaryUse: "personal",
                coverage: {
                    liability: { bodilyInjury: 100000, propertyDamage: 50000 },
                    collision: { deductible: 500 },
                    comprehensive: { deductible: 250 }
                }
            },
            {
                vehicleId: "VEH-0002",
                vin: "3FAHP0HA7AR123789",
                year: 2019,
                make: "Ford",
                model: "Fusion",
                type: "Sedan",
                primaryUse: "personal",
                coverage: {
                    liability: { bodilyInjury: 100000, propertyDamage: 50000 },
                    collision: { deductible: 1000 },
                    comprehensive: { deductible: 500 }
                }
            }
        ],
        agents: [
            { agentId: "AGT-123", name: "Sam Agent", email: "sam.agent@vroom.com" }
        ],
        createdAt: "2025-08-17T00:00:00Z",
        updatedAt: "2025-08-17T01:15:00Z"
    }
])

const columns: TableColumn<Policy>[] = [
    {
        id: 'expand',
        cell: ({ row }) =>
            h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                icon: 'i-lucide-chevron-down',
                square: true,
                'aria-label': 'Expand',
                ui: {
                    leadingIcon: [
                        'transition-transform',
                        row.getIsExpanded() ? 'duration-200 rotate-180' : ''
                    ]
                },
                onClick: () => row.toggleExpanded()
            })
    },
    {
        accessorKey: 'policyId',
        header: '#',
        cell: ({ row }) => `#${row.getValue('policyId')}`
    },
    {
        accessorKey: 'policyNumber',
        header: 'Policy Number'
    },
    {
        accessorKey: 'effectiveDate',
        header: 'Effective Date',
        cell: ({ row }) => {
            return new Date(row.getValue('effectiveDate')).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        }
    },
    {
        accessorKey: 'expirationDate',
        header: 'Expiration Date',
        cell: ({ row }) => {
            return new Date(row.getValue('expirationDate')).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        }
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => {
            return new Date(row.getValue('createdAt')).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }
    },
    {
        accessorKey: 'updatedAt',
        header: 'Last Updated',
        cell: ({ row }) => {
            return new Date(row.getValue('updatedAt')).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const color = {
                active: 'success' as const,
                inactive: 'error' as const,
            }[row.getValue('status') as string]

            return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
                row.getValue('status')
            )
        }
    },
]

const expanded = ref({ 1: true })

</script>
<template>
    <div>
        <!-- breadcrumb -->
        <div class="mb-5">
            <UBreadcrumb :items="items" />
        </div>


        <h1 class="text-2xl font-bold mb-5">Policies</h1>

        <UCard>
            <template #header>
                <div class="font-medium">All Policies</div>
            </template>
            <UTable v-model:expanded="expanded" :data="data" :columns="columns"
                :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }" class="flex-1">
                <template #expanded="{ row }">

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <section>
                            <h1 class="text-2xl font-bold mb-5">Vehicles</h1>
                        <UCard variant="outline">
                            <div class="flex flex-row items-center gap-4">
                                <div class="flex-shrink-0"> <!-- Outer container for extra space -->
                                    <div
                                        class="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                        <UIcon name="i-lucide-car" class="text-primary" size="20" />
                                    </div>
                                </div>

                                <div class="flex-1 min-w-0">
                                    <template v-if="row.original.vehicles[0]">
                                        <div class="font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {{ row.original.vehicles[0].year }}
                                            {{ row.original.vehicles[0].make }}
                                            {{ row.original.vehicles[0].model }}
                                        </div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            VIN: {{ row.original.vehicles[0].vin }}
                                        </div>

                                        <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            Primary Use: {{ row.original.vehicles[0].primaryUse.charAt(0).toUpperCase()
                                                + row.original.vehicles[0].primaryUse.slice(1) }}
                                        </div>
                                        
                                        <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        
                                            Coverage:
                                            <span v-if="row.original.vehicles[0].coverage.liability">
                                                Liability (BI: ${{
                                                    row.original.vehicles[0].coverage.liability.bodilyInjury.toLocaleString()
                                                }}, PD: ${{
                                                    row.original.vehicles[0].coverage.liability.propertyDamage.toLocaleString()
                                                }})
                                            </span>
                                            <span v-if="row.original.vehicles[0].coverage.collision">
                                                , Collision (Deductible: ${{
                                                    row.original.vehicles[0].coverage.collision.deductible.toLocaleString()
                                                }})
                                            </span>
                                            <span v-if="row.original.vehicles[0].coverage.comprehensive">
                                                , Comprehensive (Deductible: ${{
                                                    row.original.vehicles[0].coverage.comprehensive.deductible.toLocaleString()
                                                }})
                                            </span>
                                        </div>
                                    </template>

                                    <div v-else class="text-sm text-gray-400 italic">
                                        No vehicle assigned
                                    </div>
                                    
                                </div>
                            </div>
                        </UCard>
                        </section>

                        <section>
                            <h1 class="text-2xl font-bold mb-5">Policyholder</h1>

                        <UCard variant="outline">
                            <div class="flex flex-row items-center gap-4">
                                <div class="flex-shrink-0">
                                    <div
                                        class="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                        <UIcon name="i-lucide-user" class="text-primary" size="20" />
                                    </div>
                                </div>

                                <div class="flex-1 min-w-0">
                                    <div class="font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {{ row.original.policyholder.name }}
                                    </div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        DOB: {{ new Date(row.original.policyholder.dateOfBirth).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        }) }}
                                    </div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        Address: {{ row.original.policyholder.address.street }},
                                        {{ row.original.policyholder.address.city }},
                                        {{ row.original.policyholder.address.state }}
                                        {{ row.original.policyholder.address.zip }}
                                    </div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        Contact: {{ row.original.policyholder.contact.email }},
                                        {{ row.original.policyholder.contact.phone }}
                                    </div>
                                </div>
                            </div>
                            </UCard>
                        </section>

                        </div>
                </template>

            </UTable>
        </UCard>
    </div>
</template>
