import { LOGIN_SERVER_HOST, LOGIN_SERVER_PORT, EVENT_SERVER_HOST, EVENT_SERVER_PORT } from "./constants/env.js";

export const config = {
    LOGIN_SERVER: {
        host: LOGIN_SERVER_HOST,
        port: +LOGIN_SERVER_PORT
    },
    EVENT_SERVER: {
        host: EVENT_SERVER_HOST,
        port: +EVENT_SERVER_PORT
    }
}