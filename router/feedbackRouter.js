const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const feedbackRouter = express.Router();

feedbackRouter.post("/", async (req, res) => {
    const email = req.body.email;
    const content = req.body.content;
    const response = { success: false, message: "" };

    try {
        await prisma.feedback.create({
            data: {
                user: email,
                content,
            },
        });
        response.success = true;
        res.json(response);
    } catch (err) {
        console.log(err);
        response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
        res.json(response);
    }
});

module.exports = feedbackRouter;
