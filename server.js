require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json()); // body-parser

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

const userRouter = require("./router/userRouter");
const scheduleRouter = require("./router/scheduleRouter");
const threadRouter = require("./router/threadRouter");
const feedbackRouter = require("./router/feedbackRouter");
app.use("/api/user", userRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/thread", threadRouter);
app.use("/api/feedback", feedbackRouter);

const userToRoom = {};
const roomToUser = { 1: [], 2: [], 3: [], 4: [], 5: [] };

io.on("connection", (socket) => {
    var message = "";

    console.log(`소켓 연결됨 : ${socket.id}`);

    socket.on("join", (roomNo) => {
        if (!(0 < parseInt(roomNo) < 6)) {
            message = "잘못된 접근입니다";
            socket.emit("reject", message);
        } else if (roomToUser[roomNo].length >= 6) {
            message = "방이 다 찼습니다. 다른 방을 이용해 주세요";
            socket.emit("reject", message);
        } else {
            socket.emit("accept", roomToUser[roomNo]);
            roomToUser[roomNo].push(socket.id);
            userToRoom[socket.id] = roomNo;
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
        let roomNo = userToRoom[socket.id];
        if (roomNo) {
            let index = roomToUser[roomNo].indexOf(socket.id);
            roomToUser[roomNo].splice(index, 1);
            delete userToRoom[socket.id];
            roomToUser[roomNo].forEach((user) => {
                io.to(user).emit("peer quit", socket.id);
            });
        }
    });

    socket.on("message send", (message) => {
        socket.broadcast.emit("new message", message);
    });
});

server.listen(process.env.PORT || 8000, () =>
    console.log("server is running on port 8000")
);
