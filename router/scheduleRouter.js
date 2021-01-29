const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const scheduleRouter = express.Router();

// 스케쥴 불러오기
scheduleRouter.get("/:email", async (req, res) => {
    const email = req.params.email;
    const response = { success: false, message: "" };

    try {
        const userWithSchedules = await prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                schedules: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        id: true,
                        content: true,
                        progress: true,
                    },
                },
            },
        });
        response.schedules = userWithSchedules.schedules;
        response.success = true;
        res.json(response);
    } catch (err) {
        response.message = err;
        res.json(response);
    }
});

// 스케쥴 추가
scheduleRouter.post("/", async (req, res) => {
    const email = req.body.email;
    const content = req.body.content;
    const response = { success: false, message: "" };

    try {
        const schedule = await prisma.schedule.create({
            data: {
                content,
                user: {
                    connect: {
                        email,
                    },
                },
            },
            select: {
                id: true,
                content: true,
                progress: true,
            },
        });
        response.success = true;
        response.schedule = schedule;
        res.json(response);
    } catch (err) {
        console.log(err);
        response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
        res.json(response);
    }
});

// 스케쥴 변경
scheduleRouter.put("/", async (req, res) => {
    const scheduleId = req.body.scheduleId;
    const content = req.body.content;
    const progress = req.body.progress;
    const response = { success: false, message: "" };

    try {
        await prisma.schedule.update({
            where: {
                id: scheduleId,
            },
            data: {
                content,
                progress,
            },
        });
        response.success = true;
        res.json(response);
    } catch (err) {
        console.log(err);
        response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
        res.json(response);
    }
});

// 스케쥴 삭제
scheduleRouter.delete("/:scheduleId", async (req, res) => {
    const scheduleId = req.params.scheduleId;
    const response = { success: false, message: "" };

    try {
        await prisma.schedule.delete({
            where: {
                id: scheduleId,
            },
        });
        response.success = true;
        res.json(response);
    } catch (err) {
        console.log(err);
        reponse.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
        res.json(response);
    }
});

module.exports = scheduleRouter;
