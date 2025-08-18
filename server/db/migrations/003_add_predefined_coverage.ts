import type {Kysely} from "kysely";

// Sunday, August 18th - Add predefined coverage types to coverage_types table

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {

    // create users enum type as array

    await db.insertInto('coverage_types').values([
        // Policy-level coverages
        { code: 'BI_PP', name: 'Bodily Injury Liability (Per Person)', scope: 'POLICY', unit: 'USD', description: 'Max payout for bodily injury per person in an accident' },
        { code: 'BI_PA', name: 'Bodily Injury Liability (Per Accident)', scope: 'POLICY', unit: 'USD', description: 'Max payout for all bodily injuries per accident' },
        { code: 'PD_PA', name: 'Property Damage Liability', scope: 'POLICY', unit: 'USD', description: 'Max payout for damage to others property per accident' },
        { code: 'CSL', name: 'Combined Single Limit', scope: 'POLICY', unit: 'USD', description: 'Single max payout limit that combines BI and PD' },
        { code: 'UMBI_PP', name: 'Uninsured Motorist Bodily Injury (Per Person)', scope: 'POLICY', unit: 'USD', description: 'Covers injuries to insured when struck by an uninsured driver, per person' },
        { code: 'UMBI_PA', name: 'Uninsured Motorist Bodily Injury (Per Accident)', scope: 'POLICY', unit: 'USD', description: 'Covers injuries to insured when struck by an uninsured driver, per accident' },
        { code: 'UIMBI_PP', name: 'Underinsured Motorist Bodily Injury (Per Person)', scope: 'POLICY', unit: 'USD', description: 'Covers injuries when at-fault driver has too little insurance, per person' },
        { code: 'UIMBI_PA', name: 'Underinsured Motorist Bodily Injury (Per Accident)', scope: 'POLICY', unit: 'USD', description: 'Covers injuries when at-fault driver has too little insurance, per accident' },
        { code: 'PIP_PP', name: 'Personal Injury Protection', scope: 'POLICY', unit: 'USD', description: 'Medical expenses and lost wages for insured and passengers' },
        // Vehicle
        { code: 'COLL_DED', name: 'Collision Deductible', scope: 'VEHICLE', unit: 'USD', description: 'Deductible for collision coverage' },
        { code: 'COMP_DED', name: 'Comprehensive Deductible', scope: 'VEHICLE', unit: 'USD', description: 'Deductible for comprehensive coverage (fire, theft, hail, etc.)' },
        { code: 'GLASS_DED', name: 'Glass Deductible', scope: 'VEHICLE', unit: 'USD', description: 'Deductible specific to glass-only claims' },
        { code: 'RENTAL_PD', name: 'Rental Reimbursement (Per Day)', scope: 'VEHICLE', unit: 'USD', description: 'Reimburses rental costs per day while vehicle is being repaired' },
        { code: 'RENTAL_MAXDAYS', name: 'Rental Reimbursement Max Days', scope: 'VEHICLE', unit: 'RENTAL_DAYS', description: 'Maximum rental coverage days' },
        { code: 'TOWING', name: 'Towing / Roadside Assistance', scope: 'VEHICLE', unit: 'USD', description: 'Max payout or per-incident limit for towing/roadside' },
    ]).execute();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function drop(db: Kysely<any>): Promise<void> {
    await db.deleteFrom('coverage_types').where('code', 'in', [
        'BI_PP', 'BI_PA', 'PD_PA', 'CSL', 'UMBI_PP', 'UMBI_PA', 'UIMBI_PP', 'UIMBI_PA', 'PIP_PP',
        'COLL_DED', 'COMP_DED', 'GLASS_DED', 'RENTAL_PD', 'RENTAL_MAXDAYS', 'TOWING'
    ]).execute();
}