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

async function changeSchedule(id, content, state) {
    try {
        await prisma.schedule.update({
            where: {
                id,
            },
            data: {
                content,
                state,
            },
        });
    } catch (err) {
        console.error(err);
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

async function deleteSchedule(id) {
    try {
        await prisma.schedule.delete({
            where: {
                id,
            },
        });
    } catch (err) {
        console.err(err);
    }
}

// addSchedule("밥 먹기", "dennis2311");
// addSchedule("잠 자기", "dennis2311");
// addSchedule("일어나기", "dennis2311");
// deleteSchedule("0d6c35f3-baf4-4062-b955-30ae87ad7c7b");
changeSchedule("5a53a2cf-0da7-46e2-a9ac-604415bf4da1", "푹 자기", 2).then(
    () => {
        callSchedule("dennis2311");
    }
);
