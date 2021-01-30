const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addMainthread(email, college, subject, content) {
    try {
        const newThread = await prisma.mainthread.create({
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
        console.dir(newThread);
    } catch (err) {
        console.log(err);
    }
}

async function addSubthread(email, mainthreadId, content) {
    try {
        const newSubthread = await prisma.subthread.create({
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
        console.dir(newSubthread);
    } catch (err) {
        console.log(err);
    }
}

async function callAllThread_ex(pageNo) {
    try {
        const threads = await prisma.mainthread.findMany({});
        console.dir(threads);
    } catch (err) {
        console.log(err);
    }
}

async function callAllThread(pageNo) {
    try {
        const threads = await prisma.mainthread.findMany({
            skip: 10 * (pageNo - 1),
            take: 10,
            where: {},
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
        console.dir(threads);
    } catch (err) {
        console.log(err);
    }
}

async function callThread(college, pageNo) {
    try {
        const selectedThreads = await prisma.mainthread.findMany({
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
                        content: true,
                        createdAt: true,
                    },
                },
            },
        });
        console.dir(selectedThreads);
    } catch (err) {
        console.log(err);
    }
}

async function threadNum(college) {
    try {
        if (college === "All") {
            const threadNums = await prisma.mainthread.count();
            console.log(`total mainthreads : ${threadNums}`);
        } else {
            const threadNums = await prisma.mainthread.count({
                where: {
                    college,
                },
            });
            console.log(`total mainthreads of ${college} : ${threadNums}`);
        }
    } catch (err) {
        console.log(err);
    }
}

callAllThread_ex(1);
// callThread("Music", 1);
// threadNum("All");
