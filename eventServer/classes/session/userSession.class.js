import { userRepository } from "../../session.js";
import { User } from "../models/user.class.js";

export class UserSession {
    constructor(hour, minute) {
        this.users = new Map();
        this.startTime = new Date();
        this.startTime.setHours(hour, minute, 0, 0);
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
            this.countUpload();
        }, delay)
    }

    addUser (socket) {
        // console.log("유저 추가됨");
        const user = new User(socket);
        this.users.set(socket.id, user);
    }

    getUserById (id) {
        return this.users.get(id);
    }

    deleteUserById (id) {
        this.users.delete(id);
    }

    countUpload() {
        this.users.forEach(async (user, id) => {
            if (!user.lastClick || user.hasFailed ) return;
            await userRepository.enqueue(userRepository.updateCount, user.clickCounts, user.lastClick, id);
        })
    }

    getWinner() {

    }
}