import { USERS_QUERIES } from "../database/queries.js"

export class UsersRepository {
    constructor(database) {
        this.db = database;
    }

    createUser = async (name, password) => {
        const { changes } = await db.run(USERS_QUERIES.CREATE_USER, [name, password]);

        return changes > 0;
    }

    findUserByName = async (name) => {
        const user = await db.get(USERS_QUERIES.FIND_USER, [name]);
        console.log(user);

        return user != undefined;
    }
}