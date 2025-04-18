import { userSession } from "../../session.js";

export class User {
    constructor(socket) {
        this.socket = socket;
        this.hasFailed =  false;
        this.lastCounts = [];
        this.timer = null;
        this.clickCounts = 0;
        this.lastClick = null;
    }

    addCount() {
        // console.log(`현재 카운트 수 ${this.clickCounts} / 실패 여부 ${this.hasFailed}`)
        if(!userSession.isOpen || this.hasFailed ) return;
        const now = new Date();

        this.lastCounts.push(now);
        if (this.lastCounts.length > 4) {
            const delay = this.lastCounts[this.lastCounts.length-1] - this.lastCounts[0]
            if (delay < 1000) {
                // console.log(delay, "시간 너무 빠르다")
                this.hasFailed = true;
                return;
            }
                
            this.lastCounts.shift();
        }

        this.clickCounts++;
        this.lastClick = now.toISOString();

        if (this.timer) {
            clearTimeout(this.timer);
        } 
        this.timer = setTimeout(() => this.hasFailed = true, 10000)
    }
}