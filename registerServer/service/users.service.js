import { parseJson } from "../middleware/parseJson.js";

export class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
 
    createUser = async (req, res) => {
        await parseJson(req, res);
        const { name, address } = req.body
        if (!await this.userRepository.enqueue(this.userRepository.createUser, name, address))
            throw new Error("계정 생성 실패");

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results: 'Success' }));
    }
}