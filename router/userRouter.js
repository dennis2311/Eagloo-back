const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const userRouter = express.Router();

const sendMail = require("../util/sendMail");
const secretGenerator = require("../util/secretGenerator");

// 로그인
userRouter.get("/:email/:password", async (req, res) => {
    const email = req.params.email;
    const password = req.params.password;
    const response = { success: false, message: "" };
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (user) {
            if (user.password === password) {
                if (user.authenticated) {
                    if (!user.banned) {
                        response.success = true;
                    } else {
                        response.message =
                            "신고로 인하여 정지된 계정입니다. 관리자에게 문의하세요";
                    }
                } else {
                    response.message = "아직 계정 인증이 완료되지 않았어요 :/";
                }
            } else {
                response.message = "비밀번호가 일치하지 않아요 :/";
            }
        } else {
            response.message = "일치하는 메일 주소가 없어요 :/";
        }
        res.json(response);
    } catch (err) {
        console.log(err);
        response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
        res.json(response);
    }
});

// 회원가입1단계 (nodemailer)
userRouter.post("/", async (req, res) => {
    const email = req.body.email;
    const secret = secretGenerator();
    const response = { success: false, message: "" };

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (user) {
            if (user.authenticated) {
                response.message = "이미 사용 중인 메일 주소입니다";
            } else {
                await prisma.user.update({
                    where: { email },
                    data: { verificationSecret: secret },
                });
                // TODO
                // sendMail 발송 오류 처리
                if (sendMail(email, secret)) {
                    response.success = true;
                    response.message = `인증 메일이 ${email}@yonsei.ac.kr 로 발송되었습니다`;
                } else {
                    response.message = "메일 발송 중 오류가 발생했습니다";
                }
            }
        } else {
            await prisma.user.create({
                data: {
                    email,
                    verificationSecret: secret,
                },
            });
            // TODO
            // sendMail 발송 오류 처리
            if (sendMail(email, secret)) {
                response.success = true;
                response.message = `인증 메일이 ${email}@yonsei.ac.kr 로 발송되었습니다`;
            } else {
                response.message = "메일 발송 중 오류가 발생했습니다";
            }
        }
        res.json(response);
    } catch (err) {
        console.log(err);
        response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
        res.json(response);
    }
});

// 회원가입2단계 (secret 비교)
userRouter.put("/secret", async (req, res) => {
    const email = req.body.email;
    const givenSecret = req.body.givenSecret;
    const response = { success: false, message: "" };

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (user) {
            if (user.verificationSecret === givenSecret) {
                await prisma.user.update({
                    where: { email },
                    data: { authenticated: true },
                });
                response.success = true;
            } else {
                response.message = "인증 단어가 일치하지 않습니다";
            }
        } else {
            response.message =
                "임시 계정 생성이 완료되지 않았습니다. 잠시 후 다시 시도해주세요\n증상이 계속되는 경우, 관리자에게 문의해주세요";
        }
        res.json(response);
    } catch (err) {
        console.log(err);
        response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
        res.json(response);
    }
});

// 회원가입3단계 (비밀번호 설정)
userRouter.put("/password", async (req, res) => {
    const email = req.body.email;
    const givenPassword = req.body.givenPassword;
    const response = { success: false, message: "" };

    try {
        await prisma.user.update({
            where: { email },
            data: { password: givenPassword },
        });
        response.success = true;
        res.json(response);
    } catch (err) {
        console.log(err);
        response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
        res.json(response);
    }
});

module.exports = userRouter;
