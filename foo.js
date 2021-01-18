const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addSchedule(content, email) {
    try {
        await prisma.schedule.create({
            data: {
                content,
                user: {
                    connect: {
                        email,
                    },
                },
            },
        });
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
                        state: "asc",
                    },
                    select: {
                        id: true,
                        content: true,
                        state: true,
                    },
                },
            },
        });
        console.dir(userWithSchedules);
    } catch (err) {
        console.log(err);
    }
}

// addSchedule("밥 먹기", "dennis2311");
// addSchedule("잠 자기", "dennis2311");
// addSchedule("일어나기", "dennis2311");
callSchedule("dennis2311");
