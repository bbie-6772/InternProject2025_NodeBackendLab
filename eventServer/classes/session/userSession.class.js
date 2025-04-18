import { User } from "../models/user.class.js";

export class UserSession {
    constructor(hour, minute) {
        this.users = new Map();
        this.startTime = new Date();
        this.startTime.setHours(hour, minute, 0, 0);
        this.timer = null;
        this.status = false;       
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
            // console.log("시작됨");
            this.status = true;
            await new Promise((resolve) => setTimeout(() => resolve(), 60000));
            this.status = false;
            // console.log("끝");
            this.countUpload();
        }, delay)
    }

    addUser (socket) {
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

    }

    getWinner() {

    }
}