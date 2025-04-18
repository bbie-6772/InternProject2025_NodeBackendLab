import { UsersController } from "../controller/users.controller.js";
import { UsersRepository } from "../../common/database/repository/users.repository.js";
import { UsersService } from "../service/users.service.js";
import { db } from "../../common/database/database.js";
import { parseJson } from "../middleware/parseJson.js";

const usersRepository = new UsersRepository(db);
const usersService = new UsersService(usersRepository, parseJson);
const usersController = new UsersController(usersService);

export const usersRouter = {
    POST: {
        '/register': usersController.createUser,
    }
}; 