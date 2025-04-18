import { UsersController } from "../controller/users.controller.js";
import { UsersRepository } from "../repository/users.repository.js";
import { UsersService } from "../service/users.service.js";
import { db } from "../database/database.js";

const usersRepository = new UsersRepository(db);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

export const usersRouter = {
    '/register': usersController.createUser,
}; 