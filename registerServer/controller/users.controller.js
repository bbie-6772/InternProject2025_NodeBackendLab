export class UsersController {
    constructor(userService) {
        this.userService = userService;
    }

    createUser = async (req, res) => {
        try {
            await this.userService.createUser(req, res);
        } catch (err) {
            console.error(err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Bad Request' }));
        }
    }
}