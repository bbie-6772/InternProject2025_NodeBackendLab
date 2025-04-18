export const onEnd = (socket, userSession) => async () => {
    if(socket.id)
        userSession.deleteUserById(socket.id);

    socket.end();
    socket.destroy();
}