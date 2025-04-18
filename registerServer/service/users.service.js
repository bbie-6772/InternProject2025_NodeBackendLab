export class UsersService {
    constructor(userRepository, parseJson, jobQueue) {
        this.userRepository = userRepository;
        this.parseJson = parseJson;
        this.jobQueue = jobQueue;
    }
 
    createUser = async (req, res) => {
        await this.parseJson(req, res);
        const { name, address } = req.body
        if (!await this.jobQueue.enqueue(() => this.userRepository.createUser(name, address)))
            throw new Error("계정 생성 실패");

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results: 'Success' }));
    }
}