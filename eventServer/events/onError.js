export const onError = (socket, userSession) => async (err) => {
    userSession.deleteUserById(socket.id);

    console.error(err);
    socket.end();
    socket.destroy();
}