import { db } from "~~/server/db/db";
import { UserService } from "~~/server/services/userService";

const userService = new UserService(db);

export default defineEventHandler(async () => {
    console.log("Creating initial user if none exist...");
    
    const user = await userService.createInitalUserIfNoneExist({
        "email": "camnooten@gmail.com",
        "password_hash": "Test1234!",
        "first_name": "Cameron",
        "last_name": "D",
    });
    return user;
});