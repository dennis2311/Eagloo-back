const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const threadRouter = express.Router();

threadRouter.get("/:college", async (req, res) => {
    const college = req.params.college;
    const response = { success: false, message: "" };

    try {
        if (college === "Undefined") {
            response.threads = await prisma.mainthread.findMany({
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
                            content: true,
                            createdAt: true,
                        },
                    },
                },
            });
        } else {
            response.threads = await prisma.mainthread.findMany({
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
                            content: true,
                            createdAt: true,
                        },
                    },
                },
            });
        }
        response.success = true;
        res.json(response);
    } catch (err) {
        console.log(err);
        response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
        res.json(response);
    }
});

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
