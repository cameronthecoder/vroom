import { PolicyService } from "~~/server/services/policyService";
import { db } from '../../db/db';
import { newPolicyWithDefaultsSchema } from "../../../shared/types/zod";

const policyService = new PolicyService(db);

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, newPolicyWithDefaultsSchema.parse);
    const { party_id, ...policyData } = body;
    
    const policy = await policyService.createPolicy(policyData);

    if (!policy) {
        throw createError({ statusCode: 500, statusMessage: 'Failed to create policy' });
    }
    await policyService.attachCustomerToPolicy(policy, body.party_id);
    return policy;
});