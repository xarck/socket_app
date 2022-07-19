const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);
const socket = require("socket.io");

const io = socket(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.of("/chat").on("connection", (socket) => {
    socket.on("join", (data) => {
        socket.join(data.room);
        socket.emit("message", "Welcome");
        socket.to(data.room).emit("message", `${data.username} has joined`);
    });
    socket.on("message", (data) => {
        socket.to(data.room).emit("message", data.message);
    });
    socket.on("disconnect", () => {
        console.log("user has left");
    });
});

const users = {};

const socketToRoom = {};

io.of("/call").on("connection", (socket) => {
    console.log("a user connected");
    socket.on("join room", (roomID) => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", (payload) => {
        console.log(payload);
        socket.to(payload.userToSignal).emit("user joined", {
            signal: payload.signal,
            callerID: payload.callerID,
        });
    });

    socket.on("returning signal", (payload) => {
        socket.to(payload.callerID).emit("receiving returned signal", {
            signal: payload.signal,
            id: socket.id,
        });
    });

    socket.on("disconnect", () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter((id) => id !== socket.id);
            users[roomID] = room;
        }
    });
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static("build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "index.html"));
    });
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
