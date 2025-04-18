import { UserSession } from "./classes/session/userSession.class.js";
import { UsersRepository } from "../common/database/repository/users.repository.js";
import { JobQueue } from "../common/utils/jobQueue.js";
import { db } from "../common/database/database.js";
import { ClusterQueue } from "../common/clustering/clusterQueue.js";

const jobQueue = new JobQueue();
export const clusterQueue = new ClusterQueue();
export const userRepository = new UsersRepository(db);
// 이벤트 시작 시간 hour(0~23):minute(0~59)
const hour = 7;
const minute = 2;
export const userSession = new UserSession(hour, minute, jobQueue, userRepository, clusterQueue);
