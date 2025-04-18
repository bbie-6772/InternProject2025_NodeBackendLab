export const onError = (socket, userSession) => async (err) => {
    if (socket.id)
        userSession.deleteUserById(socket.id);

    console.error(err);
    socket.end();
    socket.destroy();
}