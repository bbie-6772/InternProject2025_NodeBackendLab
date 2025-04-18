import { USERS_QUERIES } from "../queries.js"

export class UsersRepository {
    constructor(database) {
        this.db = database;
        this.jobQueue = [];
        this.isQueueRunning = false;
    }
    
    queueLoop = async () => {
        while (this.jobQueue.length > 0) {
            const job = this.jobQueue.shift();
            try {
                await job();
            } catch (error) {
                console.error('Queue task error:', error);
            }
        }
        this.isQueueRunning = false;
    }  

    enqueue = (method, ...args) => {
        return new Promise((resolve, reject) => {
            this.jobQueue.push(async () => {
                try {
                    const result = await method(...args);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }  
            });

            if (!this.isQueueRunning) {
                this.isQueueRunning = true;
                this.queueLoop();
            }
        });
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

    updateCount = async (clickCount, lastClickTime, id) => {
        const query = this.db.prepare(USERS_QUERIES.UPDATE_COUNT);
        const { changes } = await query.run(clickCount, lastClickTime, id);
        return changes > 0;
    }
}