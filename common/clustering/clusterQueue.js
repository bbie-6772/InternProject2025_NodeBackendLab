export class ClusterQueue {
    constructor(processObj = process) {
        this.process = processObj;
        this.nextRequestId = 0;
        this.pendingRequests = new Map();  
        this.process.on('message', this.processMessage);  
    }

    processMessage = (msg) => {
        const { id, result, error } = msg;
        if (!this.pendingRequests.has(id)) return;

        const { resolve, reject } = this.pendingRequests.get(id);

        if (error) {
            reject(new Error(error));
        } else {
            resolve(result);
        }

        this.pendingRequests.delete(id);
    }  

    async sendRequestToMaster(msg) {
        return new Promise((resolve, reject) => {
            const id = this.nextRequestId++;
            // 요청 ID 붙이고 보냄  
            process.send({ id, ...msg });

            // 응답을 받을 때까지 대기용 resolve 저장  
            this.pendingRequests.set(id, { resolve , reject });
        });
    }
}

