import type { Users, DB } from '~/types/db';
import type { Kysely, Selectable } from 'kysely';


export class AuthenticationService {
    constructor(private db: Kysely<DB>) {}

    async getUserByEmail(email: string): Promise<Selectable<Users> | undefined> {
        return await this.db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();
    }

}