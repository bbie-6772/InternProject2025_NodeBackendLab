export const onEnd = (socket) => async () => {

    socket.end();
    socket.destroy();
}