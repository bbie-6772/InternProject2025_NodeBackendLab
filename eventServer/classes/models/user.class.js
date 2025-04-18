export class User {
    constructor(socket) {
        this.socket = socket;
        this.lastCounts = [];
        this.clickCounts = 0;
        this.lastClick = null;
    }

    addCount() {

    }
}