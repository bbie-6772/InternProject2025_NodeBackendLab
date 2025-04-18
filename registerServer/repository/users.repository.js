import { USERS_QUERIES } from "../../common/database/queries.js"

export class UsersRepository {
    constructor(database) {
        this.db = database;
    }

    createUser = async (name, password) => {
        const query = this.db.prepare(USERS_QUERIES.CREATE_USER);
        const { changes } = await query.run(name, password);
        return changes > 0;
    }
}