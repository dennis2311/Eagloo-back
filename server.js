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

const userToRoom = {};

io.on("connection", (user) => {
    console.log(`소켓 연결됨 : ${user.id}`);

    user.on("enter", (payload) => {
        if (0 >= parseInt(payload.roomNo) || parseInt(payload.roomNo) >= 7) {
            io.to(user.id).emit("rejected", "방이 존재하지 않습니다");
        } else {
            const roomName = `room${payload.roomNo}`;
            user.join(roomName);
            const roomUsers = Object.keys(
                io.sockets.adapter.rooms[roomName].sockets
            );
            if (roomUsers.length >= 6) {
                user.leave(roomName);
                io.to(user.id).emit(
                    "rejected",
                    "방이 꽉 찼습니다. 다른 방을 이용해 주세요"
                );
            } else {
                userToRoom[user.id] = roomName;
                io.to(user.id).emit("accepted", roomUsers);
                console.log(
                    `${user.id}(${payload.email})이 ${roomName}에 입장함. 현재 방 인원 : ${roomUsers.length}`
                );
            }
        }
    });

    // TODO
    // 캠 요청 중 상대가 나가는 경우 처리
    user.on("request peer cam", (payload) => {
        if (userToRoom[payload.peerId]) {
            console.log(`${user.id}가 ${payload.peerId}의 캠 요청함`);
            io.to(payload.peerId).emit("cam requested", {
                index: payload.index,
                callerId: payload.callerId,
                signal: payload.signal,
            });
        } else {
            console.log(`${user.id}의 캠 요청 중 ${payload.peerId} 퇴장함`);
            io.to(user.id).emit("peer dead", { index: payload.index });
        }
    });

    user.on("accept peer cam request", (payload) => {
        console.log(`${user.id}가 ${payload.callerId}의 캠 요청 수락함`);
        io.to(payload.callerId).emit("cam request accepted", {
            index: payload.index,
            signal: payload.signal,
        });
    });

    // TODO
    // 캠 수락 이후 상대가 나가는 경우 처리
    user.on("peer still alive", (payload) => {
        if (!userToRoom[payload.peerId]) {
            io.to(user.id).emit("peer dead", { index: payload.index });
        }
    });

    user.on("quit", (email) => {
        console.log(`${user.id}(${email})가 ${userToRoom[user.id]} 나감`);
        user.leave(userToRoom[user.id]);
        io.sockets.in(userToRoom[user.id]).emit("peer quit", user.id);
        delete userToRoom[user.id];
        console.log("방 입장 현황 : ");
        console.dir(userToRoom);
    });

    user.on("message send", (message) => {
        user.broadcast.emit("new message", message);
    });

    user.on("disconnect", () => {
        console.log(`소켓 연결 두절 : ${user.id}`);
        io.sockets.in(userToRoom[user.id]).emit("peer quit", user.id);
        delete userToRoom[user.id];
        console.log("방 입장 현황 : ");
        console.dir(userToRoom);
    });
});

server.listen(process.env.PORT || 8000, () =>
    console.log(`server is running on ${process.env.PORT || `port 8000`}`)
);
