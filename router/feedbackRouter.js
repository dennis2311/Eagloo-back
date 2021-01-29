const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const feedbackRouter = express.Router();

feedbackRouter.post("/", async (req, res) => {
    const response = { success: false, message: "" };

    try {
    } catch (err) {
        console.log(err);
    }
});

module.exports = feedbackRouter;
