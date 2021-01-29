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

async function callThread(college) {
    try {
        if (college === "Undefined") {
            const allThreads = await prisma.mainthread.findMany({
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
            console.dir(allThreads);
        } else {
            const selectedThreads = await prisma.mainthread.findMany({
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
        }
    } catch (err) {
        console.log(err);
    }
}

// addMainthread(
//     "dennis2311",
//     "Music",
//     "음대 복전 가능한가요?",
//     "제가 클라리넷을 모차르트 뺨따구를 좌우로 후릴만큼 잘 부는데 가능한가요?"
// );

// addSubthread(
//     "dennis2311",
//     "ade034b8-39f6-4adb-a275-4801e364c4cb",
//     "저도 졸업하고 싶어요"
// ).then(() => {
//     callThread("Undefined");
// });

callThread("Music");
