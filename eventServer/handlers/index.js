import { config } from "../../common/config/config.js"
import { clickHandler } from "./user/click.handler.js"
import { createUserHandler } from "./user/createUser.handler.js"

export const handlers = {
    [config.header.packetType.C_CLICK_REQUEST] : clickHandler ,
    [config.header.packetType.C_LOGIN_REQUEST] : createUserHandler
}