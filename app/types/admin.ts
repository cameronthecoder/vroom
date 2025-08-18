// types/admin.ts

export interface NavigationItem {
    name: string
    label: string
    icon: string
  }
  
  export interface DashboardStat {
    title: string
    value: string
    icon: string
  }
  
  export interface Activity {
    id: number
    type: string
    description: string
    time: string
  }
  
  export interface Client {
    id: number
    name: string
    email: string
    phone: string
    policies: number
    status: string
  }
  
  export interface Policy {
    id: number
    policyNumber: string
    type: string
    client: string
    premium: number
    expiryDate: string
    status: string
  }
  
  export interface Claim {
    id: number
    claimNumber: string
    client: string
    type: string
    amount: number
    date: string
    status: string
  }
  
  export interface PolicyType {
    name: string
    count: number
  }
  
  export interface TableColumn {
    key: string
    label: string
    sortable?: boolean
  }
  
  export interface DropdownItem {
    label: string
    icon: string
    class?: string
  }