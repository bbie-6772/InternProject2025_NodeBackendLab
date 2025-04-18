export class UsersController {
    constructor(userService) {
        this.userService = userService;
    }

    createUser = async (req, res) => {
        try {
            console.log(req.body);

            await this.userService.createUser();
        } catch (err) {
            console.error(err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end('400 - Bad Request');
        }
    }

    findUserByName = async (req, res) => {
        try {

        } catch (err) {
            console.error(err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end('400 - Bad Request');
        }
    }

}