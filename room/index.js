const { v4: uuidV4 } = require("uuid");

const rooms = {};

const roomHandler = (socket) => {
    const createRoom = () => {
        const roomId = uuidV4();
        rooms[roomId] = {};
        socket.emit("room-created", { roomId });
        console.log("User created the room", roomId);
    };

    const joinRoom = ({ roomId, peerId }) => {
        if (!rooms[roomId]) {
            socket.emit("room-not-found", { roomId });
            return;
        }
        console.log("User joined the room", roomId, peerId);
        rooms[roomId][peerId] = { peerId };
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", { peerId });
        socket.emit("get-users", {
            roomId,
            participants: Object.values(rooms[roomId]),
        });

        socket.on("disconnect", () => {
            console.log("User left the room", peerId);
            leaveRoom({ roomId, peerId });
        });
    };

    const leaveRoom = ({ roomId, peerId }) => {
        if (rooms[roomId] && rooms[roomId][peerId]) {
            delete rooms[roomId][peerId];
            socket.to(roomId).emit("user-disconnected", peerId);
        }
    };

    const checkRoomExists = (roomId) => {
        if (rooms[roomId]) {
            socket.emit("room-exists", { roomId });
        } else {
            socket.emit("room-not-found", { roomId });
        }
    };

    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("leave-room", leaveRoom);
    socket.on("check-room-exists", checkRoomExists);
};

module.exports = roomHandler;
