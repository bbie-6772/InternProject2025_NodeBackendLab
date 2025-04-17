import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, LOGIN_SERVER_HOST, LOGIN_SERVER_PORT, EVENT_SERVER_HOST, EVENT_SERVER_PORT } from "./constants/env.js";

export const config = {
    databases: {
        USER_DB: {
            name: DB_NAME,
            user: DB_USER,
            password: DB_PASSWORD,
            host: DB_HOST,
            port: +DB_PORT
        },
    },
    LOGIN_SERVER: {
        host: LOGIN_SERVER_HOST,
        port: +LOGIN_SERVER_PORT
    },
    EVENT_SERVER: {
        host: EVENT_SERVER_HOST,
        port: +EVENT_SERVER_PORT
    }
}