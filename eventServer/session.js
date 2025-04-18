import { UserSession } from "./classes/session/userSession.class.js";
import { UsersRepository } from "../common/database/repository/users.repository.js";
import { db } from "../common/database/database.js";

// 시작 시간 (HH, MM) = HH:MM 
export const userSession = new UserSession(15, 40);
export const userRepository = new UsersRepository(db);