const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const secretGenerator = require("./secretGenerator");

async function foo(email) {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (user) {
        console.log(user);
    } else {
        console.log("유저가 없습니다");
    }
}

foo("denni");
