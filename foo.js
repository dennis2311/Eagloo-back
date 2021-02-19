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
