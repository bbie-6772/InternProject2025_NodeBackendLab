export class JobQueue {
    constructor() {
        this.jobQueue = [];
        this.isQueueRunning = false;
    }

    queueLoop = async () => {
        while (this.jobQueue.length > 0) {
            const job = this.jobQueue.shift();
            try {
                await job();
            } catch (err) {
                console.error('Queue task error:', err);
            }
        }
        this.isQueueRunning = false;
    };

    enqueue = (job) => {
        return new Promise((resolve, reject) => {
            this.jobQueue.push(async () => {
                try {
                    const result = await job();
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
    };
}  
