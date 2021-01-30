const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const threadRouter = express.Router();

// 전체 메인스레드 수 반환
threadRouter.get("/all/total", async (req, res) => {
    const response = { success: false, message: "" };

    try {
        response.totalThreads = await prisma.mainthread.count();
        console.log(response.totalThreads);
        response.success = true;
        res.json(response);
    } catch (err) {
        console.log(err);
        response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
        res.json(response);
    }
});

// n번째 페이지 스레드 반환
threadRouter.get("/all/page/:pageNo", async (req, res) => {
    const pageNo = parseInt(req.params.pageNo);
    const response = { success: false, message: "" };

    try {
        response.threads = await prisma.mainthread.findMany({
            skip: 10 * (pageNo - 1),
            take: 10,
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
                subthreads: {
                    orderBy: {
                        createdAt: "asc",
                    },
                    select: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                        id: true,
                        content: true,
                        createdAt: true,
                    },
                },
            },
        });
        console.dir(response.threads);
        response.success = true;
        res.json(response);
    } catch (err) {
        console.log(err);
        response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
        res.json(response);
    }
});

// 특정 대학 전체 메인스레드 수 반환
threadRouter.get("/:college/total", async (req, res) => {
    const college = req.params.college;
    const response = { success: false, message: "" };

    try {
        response.totalThreads = await prisma.mainthread.count({
            where: {
                college,
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

// 특정 대학 n번째 페이지 스레드 반환
threadRouter.get("/:college/page/:pageNo", async (req, res) => {
    const college = req.params.college;
    const pageNo = parseInt(req.params.pageNo);
    const response = { success: false, message: "" };

    try {
        response.threads = await prisma.mainthread.findMany({
            skip: 10 * (pageNo - 1),
            take: 10,
            where: {
                college,
            },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
                subthreads: {
                    orderBy: {
                        createdAt: "asc",
                    },
                    select: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                        id: true,
                        content: true,
                        createdAt: true,
                    },
                },
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

// 메인 스레드 생성
threadRouter.post("/main", async (req, res) => {
    const email = req.body.email;
    const college = req.body.college;
    const subject = req.body.subject;
    const content = req.body.content;
    const response = { success: false, message: "" };

    try {
        await prisma.mainthread.create({
            data: {
                college,
                subject,
                content,
                user: {
                    connect: {
                        email,
                    },
                },
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

// 서브 스레드 생성
threadRouter.post("/sub", async (req, res) => {
    const email = req.body.email;
    const mainthreadId = req.body.mainthreadId;
    const content = req.body.content;
    const response = { success: false, message: "" };

    try {
        await prisma.subthread.create({
            data: {
                user: {
                    connect: {
                        email,
                    },
                },
                mainthread: {
                    connect: {
                        id: mainthreadId,
                    },
                },
                content,
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

module.exports = threadRouter;
