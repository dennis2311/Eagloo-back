require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json()); // body-parser

const http = require("http");
const server = http.createServer(app);

const socket = require("socket.io");
const io = socket(server, {
    cors: {
        origin: "*",
        allowedHeaders: ["eagloo-chatting", "eagloo-study-room"],
        credentials: true,
    },
});

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

// const userToRoom = {};
// const roomToUser = { 1: [], 2: [], 3: [], 4: [], 5: [] };
const room = [];

io.on("connection", (user) => {
    var message = "";

    console.log(`소켓 연결됨 : ${user.id}`);

    user.on("enter", (roomNo) => {
        // if (roomNo > 6) {
        //     message = "잘못된 접근입니다";
        //     user.emit("rejected", message);
        //     console.log(`${user.id}의 방 입장 거부됨01`);
        // } else if (room.length >= 7) {
        //     message = "방이 다 찼습니다. 다른 방을 이용해 주세요";
        //     user.emit("rejected", message);
        //     console.log(`${user.id}의 방 입장 거부됨02`);
        // } else {

        io.to(user.id).emit("accepted", room);
        // userToRoom[user.id] = roomNo;
        room.push(user.id);
        console.log(`${user.id}이 ${roomNo}번 방에 입장함`);

        // }

        // if (!(0 < parseInt(roomNo) < 7)) {
        //     message = "잘못된 접근입니다";
        //     user.emit("rejected", message);
        // } else if (roomToUser[parseInt(roomNo)].length) {
        //     message = "방이 다 찼습니다. 다른 방을 이용해 주세요";
        //     user.emit("rejected", message);
        // } else {
        //     user.emit("accepted", roomToUser[roomNo]);
        //     roomToUser[roomNo].push(user.id);
        //     userToRoom[user.id] = roomNo;
        // }
    });

    user.on("request peer cam", (payload) => {
        // io.to(payload.peerId).emit("cam requested", {
        //     signal: payload.signal,
        //     callerId: payload.callerId,
        // });
        console.log(`${user.id}가 ${payload.peerId}의 캠 요청함`);
    });

    user.on("accept peer cam request", (payload) => {
        // io.to(payload.callerId).emit("cam request accepted", {
        //     signal: payload.signal,
        //     id: user.id,
        // });
        console.log(`${user.id}가 ${payload.callerId}의 캠 요청 수락함`);
    });

    user.on("quit", () => {
        console.log(`${user.id} 방 나감`);
        let index = room.indexOf(user.id);
        room.splice(index, 1);
        // let roomNo = userToRoom[user.id];
        // if (roomNo) {
        //     let index = roomToUser[roomNo].indexOf(user.id);
        //     roomToUser[roomNo].splice(index, 1);
        //     delete userToRoom[user.id];
        //     roomToUser[roomNo].forEach((user) => {
        //         io.to(user).emit("peer quit", user.id);
        //     });
        // }
    });

    user.on("message send", (message) => {
        user.broadcast.emit("new message", message);
    });

    user.on("disconnect", () => {
        console.log(`${user.id} 소켓 연결 두절`);
        let index = room.indexOf(user.id);
        room.splice(index, 1);
    });
});

server.listen(process.env.PORT || 8000, () =>
    console.log("server is running on port 8000")
);
