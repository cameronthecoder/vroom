import type { Policies, DB, PolicyParties, PolicyPartyRole } from '../../shared/types/db';
import type { Insertable, Kysely, Selectable } from 'kysely';

type Policy = Selectable<Policies>
type PolicyPartyRow = Selectable<PolicyParties>

export class PolicyService {
    constructor(private db: Kysely<DB>) { }

    async getPolicies(): Promise<Policy[]> {
        return await this.db.selectFrom('policies').selectAll().execute();
    }

    async getPolicyById(id: string): Promise<Policy | undefined> {
        return await this.db.selectFrom('policies').selectAll().where('id', '=', id).executeTakeFirst();
    }

    async createPolicy(policy: Insertable<Policies>): Promise<Policy | undefined> {
        const newPolicy = await this.db.insertInto('policies').values(policy).returningAll().executeTakeFirst();
        return newPolicy;
    }

    async attachCustomerToPolicy(policy: Policy, partyId: string, role?: PolicyPartyRole): Promise<PolicyPartyRow | undefined> {
        const attachment = await this.db.insertInto('policy_parties').values({
            policy_id: policy.id,
            party_id: partyId,
            role: role ?? 'NAMED_INSURED',
            effective_at: policy.effective_at,
            expires_at: policy.expires_at
        }).returningAll().executeTakeFirst();
        return attachment;
    }
}