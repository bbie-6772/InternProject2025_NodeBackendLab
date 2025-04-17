import { db } from "../database.js"
import { USERS_QUERIES } from "../queries.js"

export const createUser = async (name, password) => {
    await db.run(USERS_QUERIES.CREATE_USER, [name, password]);
}

export const findUserByName = async (name) => {
    const user = await db.get(USERS_QUERIES.FIND_USER, [name]);
    console.log(user);

    return user != undefined;
}