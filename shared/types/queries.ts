export interface CustomerSearchResult {
    party_id: string
    name: string
    display_name: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    license_number: string
    license_state: string
  }