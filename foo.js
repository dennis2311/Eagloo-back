const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addFeedback(email, content) {
    try {
        const feedback = await prisma.feedback.create({
            data: {
                content,
                user: email,
            },
            select: {
                id: true,
                user: true,
                content: true,
                createdAt: true,
            },
        });
        console.dir(feedback);
    } catch (err) {
        console.log(err);
    }
}

async function callSchedule(email) {
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
                        createdAt: true,
                    },
                },
            },
        });
        console.dir(userWithSchedules);
    } catch (err) {
        console.log(err);
    }
}

callSchedule("dennis2311");
