import { UserSession } from "./classes/session/userSession.class.js";
import { UsersRepository } from "../common/database/repository/users.repository.js";
import { JobQueue } from "../common/utils/jobQueue.js";
import { db } from "../common/database/database.js";

// 시작 시간 (HH, MM) = HH:MM 
const jobQueue = new JobQueue();
export const userRepository = new UsersRepository(db);
export const userSession = new UserSession(15, 0, jobQueue, userRepository);
