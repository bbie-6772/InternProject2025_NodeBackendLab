export const onError = (socket) => async (err) => {

    console.error(err);
    socket.end();
    socket.destroy();
}