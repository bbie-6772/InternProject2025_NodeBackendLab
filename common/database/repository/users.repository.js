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
        const results = await query.get(name);
        return results;
    }

    getWinner = async () => {
        const query = this.db.prepare(USERS_QUERIES.GET_WINNER);
        const user = await query.all();
        return user;
    }

    updateCount = async (clickCount, lastClickTime, id) => {
        const query = this.db.prepare(USERS_QUERIES.UPDATE_COUNT);
        const { changes } = await query.run(clickCount, lastClickTime, id);
        return changes > 0;
    }
}