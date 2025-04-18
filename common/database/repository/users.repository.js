import { USERS_QUERIES } from "../queries.js"

export class UsersRepository {
    constructor(database) {
        this.db = database;
    }

    createUser = async (name, address) => {
        const query = this.db.prepare(USERS_QUERIES.CREATE_USER);
        const { changes } = await query.run(name, address);
        return changes > 0;
    }

    findUser = async (name) => {
        const query = this.db.prepare(USERS_QUERIES.FIND_USER);
        const id = await query.get(name);
        return id;
    }

    getWinner = async () => {
        const query = this.db.prepare(USERS_QUERIES.GET_WINNER);
        const user = await query.all();
        return user;
    }

    updateCount = async (id, count, lastClickTime) => {
        const query = this.db.prepare(USERS_QUERIES.UPDATE_COUNT);
        const { changes } = await query.run(id, count, lastClickTime);
        return changes > 0;
    }
}