import { REGISTER_SERVER_HOST, REGISTER_SERVER_PORT, EVENT_SERVER_HOST, EVENT_SERVER_PORT } from "./constants/env.js";

export const config = {
    server: {
        register: {
            host: REGISTER_SERVER_HOST,
            port: +REGISTER_SERVER_PORT
        },
        event: {
            host: EVENT_SERVER_HOST,
            port: +EVENT_SERVER_PORT
        }
        
    },
    header: {
        
    }
    
}