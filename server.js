require("dotenv").config();

const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const socket = require("socket.io");
const io = socket(server);

const cors = require("cors");
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const router = require("./router");
app.use("/api", router);

const users = {};
const rooms = {
    a: [],
    b: [],
    business: [],
    engineer: [],
    underwood: [],
    socsci: [],
};

io.on("connection", (socket) => {
    var message = "";
    socket.on("join", (roomNo) => {
        if (!rooms[roomNo]) {
            message = "잘못된 접근입니다";
            socket.emit("reject", message);
        } else if (rooms[roomNo].length >= 6) {
            message = "방이 다 찼습니다. 다른 방을 이용해 주세요";
            socket.emit("reject", message);
        } else {
            socket.emit("accept", rooms[roomNo]);
            rooms[roomNo].push(socket.id);
            users[socket.id] = roomNo;
        }
    });

    socket.on("request peer cam", (payload) => {
        io.to(payload.peerId).emit("cam requested", {
            signal: payload.signal,
            callerId: payload.callerId,
            index: payload.index,
        });
    });

    socket.on("accept peer cam request", (payload) => {
        io.to(payload.callerId).emit("cam request accepted", {
            signal: payload.signal,
            id: socket.id,
            index: payload.index,
        });
    });

    socket.on("disconnect", () => {
        let roomNo = users[socket.id];
        if (roomNo) {
            let index = rooms[roomNo].indexOf(socket.id);
            rooms[roomNo].splice(index, 1);
            delete users[socket.id];
            rooms[roomNo].forEach((user) => {
                io.to(user).emit("peer quit", socket.id);
            });
        }
    });
});

server.listen(process.env.PORT || 8000, () =>
    console.log("server is running on port 8000")
);
