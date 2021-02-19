// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
const sendMail = require("./util/sendMail");

// async function addMainthread(email, college, subject, content) {
//     try {
//         const newThread = await prisma.mainthread.create({
//             data: {
//                 college,
//                 subject,
//                 content,
//                 user: {
//                     connect: {
//                         email,
//                     },
//                 },
//             },
//         });
//         console.dir(newThread);
//     } catch (err) {
//         console.log(err);
//     }
// }

sendMail("dennis2311", "지금도 될까?");
