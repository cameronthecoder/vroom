import type { Users, DB } from '../../shared/types/db';
import type { Insertable, Kysely, Selectable } from 'kysely';

type User = Selectable<Users>;

export class UserService {
    constructor(private db: Kysely<DB>) {}

    async createUser(user: Insertable<Users>): Promise<Selectable<User>> {

        const emailExists = await this.db.selectFrom('users').selectAll().where('email', '=', user.email).executeTakeFirst();
        if (emailExists) throw new Error('Email already in use');

        user.password_hash = await hashPassword(user.password_hash);

        const [newUser] = await this.db.insertInto('users').values(user).returningAll().execute();
        return newUser;
    }

    async createInitalUserIfNoneExist(user: Insertable<Users>): Promise<User | null> {
            console.log("No users found, creating initial user...");
            user.password_hash = await hashPassword(user.password_hash);
            const [newUser] = await this.db.insertInto('users').values(user).returningAll().execute();
            return newUser;

}
}