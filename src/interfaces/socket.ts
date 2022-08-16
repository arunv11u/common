import { Server } from 'socket.io';

interface SocketIO {
    initialise(io: Server): void;
};

export {
    SocketIO
};
