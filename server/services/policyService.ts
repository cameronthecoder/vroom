import type { Policies, DB } from '../../shared/types/db';
import type { Insertable, Kysely, Selectable } from 'kysely';


export class PolicyService {
    constructor(private db: Kysely<DB>) {}

    async getPolicies(): Promise<Selectable<Policies>[]> {
        return await this.db.selectFrom('policies').selectAll().execute();
    }

    async getPolicyById(id: string): Promise<Selectable<Policies> | undefined> {
        return await this.db.selectFrom('policies').selectAll().where('id', '=', id).executeTakeFirst();
    }

    async createPolicy(policy: Insertable<Policies>): Promise<Selectable<Policies>> {
        const [newPolicy] = await this.db.insertInto('policies').values(policy).returningAll().execute();
        if (!newPolicy) {
            throw new Error('Failed to create policy');
        }
        return newPolicy;
    }
}