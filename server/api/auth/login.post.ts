import { z } from 'zod';
import { db } from '../../db/db';
import { AuthenticationService } from '../../services/authService';

const loginSchema = z.object({
    email: z.email({ message: 'Invalid email address' }),
    password: z.string()
});

const authService = new AuthenticationService(db);

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, loginSchema.parse);

    console.log(body);
    

    const user = await authService.getUserByEmail(body.email);

    console.log(user);
    

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' });
    }

    const isPasswordValid = await verifyPassword(user.password_hash, body.password);
    console.log(isPasswordValid);
    

    if (!isPasswordValid) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' });
    }

    await setUserSession(event, { user: { id: user.id, first_name: user.first_name, last_name: user.last_name } });

    return { message: 'Login successful' };

});