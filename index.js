const express = require('express');
const http = require('http');
const roomHandler = require('./room');
// roomHandler
// roomHandler

const app = express();
const port = 3001;
const server = http.createServer(app);
// roomHandler

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("User is connected");
    roomHandler(socket);
    // socket.on("disconnect", () => {
    //     console.log("User is disconnected");
    // });

  
});

app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
