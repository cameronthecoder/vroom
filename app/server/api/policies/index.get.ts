import { db } from '@/server/db/db';
import { PolicyService } from '~/server/services/policyService';

const policyService = new PolicyService(db);

export default defineEventHandler(async () => {
    const policies = await policyService.getPolicies();
    return policies;
});