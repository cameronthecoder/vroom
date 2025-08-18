import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const algorithm = 'HS256';
const exprirationTime = process.env.JWT_EXPIRATION || '2h';

enum USER_ROLES {
    AGENT = "AGENT",
    ADMIN = "ADMIN",
    CUSTOMER = "CUSTOMER",
}

export type JwtUser = {
    id: string;
    email: string;
    roles: USER_ROLES[];
}

export const signJwt = async (user: JwtUser): Promise<string> => {
    return await new SignJWT(user)
        .setProtectedHeader({ alg: algorithm })
        .setIssuedAt()
        .setSubject(user.id)
        .setExpirationTime(exprirationTime)
        .sign(secret);
}

export const verifyJwt = async (token: string): Promise<JwtUser & { iat: number; exp: number; sub: string }> => {
    const { payload } = await jwtVerify(token, secret, {
        algorithms: [algorithm]
    });
    return payload as JwtUser & { iat: number; exp: number; sub: string };
}

