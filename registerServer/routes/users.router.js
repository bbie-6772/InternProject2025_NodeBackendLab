import { UsersController } from "../controller/users.controller.js";
import { UsersRepository } from "../../common/database/repository/users.repository.js";
import { UsersService } from "../service/users.service.js";
import { JobQueue } from "../../common/utils/jobQueue.js";
import { db } from "../../common/database/database.js";
import { parseJson } from "../middleware/parseJson.js";

const jobQueue = new JobQueue();
const usersRepository = new UsersRepository(db);
const usersService = new UsersService(usersRepository, parseJson, jobQueue);
const usersController = new UsersController(usersService);

export const usersRouter = {
    POST: {
        '/register': usersController.createUser,
    }
}; 