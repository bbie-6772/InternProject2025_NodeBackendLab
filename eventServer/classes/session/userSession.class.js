import { User } from "../models/user.class.js";

export class UserSession {
    constructor(hour, minute, jobQueue, userRepository) {
        this.startTime = new Date();
        this.startTime.setHours(hour, minute, 0, 0);

        this.jobQueue = jobQueue;
        this.userRepository = userRepository;

        this.users = new Map();
        this.timer = null;
        this.isOpen = false;       
        this.timerStart();
    }

    timerStart() {
        if (this.timer !== null) return;

        const now = new Date();
        if ( this.startTime < now )
            this.startTime.setDate(this.startTime.getDate() + 1);
        const delay = this.startTime - now;

        // console.log(`실행까지 남은시간 ${Math.round(delay / 60000) } 분`);

        this.timer = setTimeout( async ()=> {
            this.isOpen = true;
            // console.log("시작됨");
            await new Promise((resolve) => setTimeout(() => resolve(), 60000));
            this.isOpen = false;
            // console.log("끝");
            await this.countUpload();
        }, delay)
    }

    addUser(id) {
        // console.log("유저 추가됨");
        const user = new User(this);
        this.users.set(id, user);
    }

    getUserById (id) {
        return this.users.get(id);
    }

    deleteUserById (id) {
        this.users.delete(id);
    }

    async countUpload() {
        await Promise.all(Array.from(this.users.entries()).map(([id, user]) => {
            if (!user.lastClick || user.hasFailed) return Promise.resolve();
            return this.jobQueue.enqueue(() => this.userRepository.updateCount(user.clickCounts, user.lastClick, id));
        }));  
    }

    async getWinner () {
        return await this.jobQueue.enqueue(() => this.userRepository.getWinner());
    }
}