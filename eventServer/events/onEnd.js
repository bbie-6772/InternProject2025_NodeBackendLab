export const onEnd = (socket, userSession) => async () => {
    userSession.deleteUserById(socket.id);

    socket.end();
    socket.destroy();
}