import { usersRouter } from "./users.router.js";

export const routes = { 
    POST: {
        ...usersRouter.POST,
    }
};  