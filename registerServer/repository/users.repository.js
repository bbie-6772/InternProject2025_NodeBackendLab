import { USERS_QUERIES } from "../../common/database/queries.js"

export class UsersRepository {
    constructor(database) {
        this.db = database;
    }

    createUser = async (name, address) => {
        const query = this.db.prepare(USERS_QUERIES.CREATE_USER);
        const { changes } = await query.run(name, address);
        return changes > 0;
    }
}