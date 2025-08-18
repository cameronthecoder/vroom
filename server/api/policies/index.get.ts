import { db } from '../../db/db';
import { PolicyService } from '../../services/policyService';

const policyService = new PolicyService(db);

export default defineEventHandler(async () => {
    const policies = await policyService.getPolicies();
    return policies;
});