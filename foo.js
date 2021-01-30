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

callThread("Music", 2);
