import { REGISTER_SERVER_HOST, REGISTER_SERVER_PORT, EVENT_SERVER_HOST, EVENT_SERVER_PORT } from "./constants/env.js";

export const config = {
    REGISTER_SERVER: {
        host: REGISTER_SERVER_HOST,
        port: +REGISTER_SERVER_PORT
    },
    EVENT_SERVER: {
        host: EVENT_SERVER_HOST,
        port: +EVENT_SERVER_PORT
    }
}