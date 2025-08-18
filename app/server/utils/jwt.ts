import {SignJWT, jwtVerify} from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const algorithm = 'HS256';
const exprirationTime = process.env.JWT_EXPIRATION || '2h';


export type JwtUser = {
    id: string;
    email: string;
    roles: []
}