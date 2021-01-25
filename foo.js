const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addSchedule(email, content) {
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
        });
        console.dir(schedule);
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

addSchedule("dennis2311", "건의 게시판 만들기");
