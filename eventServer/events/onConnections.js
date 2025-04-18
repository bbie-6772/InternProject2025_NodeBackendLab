import { onEnd } from "./onEnd.js"
import { onData } from "./onData.js"
import { onError } from "./onError.js"
import { handlers } from "../handlers/index.js"

export const onConnection = async (socket) => {
    console.log("새로운 유저 접속", socket.remoteAddress, socket.remotePort);
    socket.buffer = Buffer.alloc(0);

    socket.on('data', onData(socket, handlers, onEnd));
    socket.on('end', onEnd(socket));
    socket.on('error', onError(socket));
}