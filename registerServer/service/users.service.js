import { parseJson } from "../middleware/parseJson.js";

export class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
 
   createUser = async (req, res) => {
        await parseJson(req, res);
        const { name, password } = req.body
        if (!await this.userRepository.createUser(name, password))
            throw new Error ("계정 생성 실패");
       res.writeHead(200, { 'Content-Type': 'application/json' });
       res.end(JSON.stringify({ results: 'Success' }));
    }
}