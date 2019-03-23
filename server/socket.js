var io = require('socket.io')(http);

export class Socket {
    on(eventName, clbck) {
        io.on(eventName, (data) => clbck(data));
    }

    emit(socket, eventName, data) {
        socket.emit(eventName, JSON.stringify(data));
    }
}