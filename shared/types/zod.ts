import { z } from 'zod';
import validator from 'validator';

export const US_STATE = z.enum([
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ]);

export const POLICY_STATUS = z.enum([
    'ACTIVE',
    'INACTIVE',
    'PENDING',
    'CANCELLED'
]);

export const POLICY_PARTY_ROLE = z.enum([
    'NAMED_INSURED',
    'ADDITIONAL_INSURED',
    'DRIVER',
    'EXCLUDED',
    'CONTACT',
    'BENEFICIARY'
]);
  

export const newCustomerSchema = z.object({
    first_name: z.string().min(1, { message: 'First name is required' }),
    last_name: z.string().min(1, { message: 'Last name is required' }),
    phone: z.string().refine(validator.isMobilePhone, {message: 'Invalid phone number'}),
    license_number: z.string().optional(),
    license_state: z.enum(US_STATE.enum, { message: 'License state must be a valid US state' }),
});

export const newPolicySchema = z.object({
    status: z.enum(POLICY_STATUS.enum).optional().default(POLICY_STATUS.enum.PENDING),
    effective_at: z.iso.datetime({ message: 'Effective date must be a valid date', offset: true }).optional(),
    expires_at: z.iso.datetime({ message: 'Expiration date must be a valid date', offset: true }).optional(),
    currency: z.string().optional().default('USD'),
    state: z.enum(US_STATE.enum, { message: 'State must be a valid US state' }),
});

export const policyPartySchema = z.object({
    role: POLICY_PARTY_ROLE.default('NAMED_INSURED'),
    effective_at: z.iso.datetime({ message: 'Effective date must be a valid date', offset: true }),
    expires_at: z.iso.datetime({ message: 'Expiration date must be a valid date', offset: true }),
});

export const newPolicyWithDefaultsSchema = newPolicySchema.extend({
    effective_at: z.iso.datetime().default(() => new Date().toISOString()),
    expires_at: z.iso.datetime().default(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        return date.toISOString();
    }),
    party_id: z.string()
});
