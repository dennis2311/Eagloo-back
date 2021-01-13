const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();

const sendMail = require("./sendMail");
const secretGenerator = require("./secretGenerator");

/*
TODO
 - CORS 일괄 세팅
 - 로그인 (email pw 비교)
 - 회원가입1 (계정 생성 + secret 생성)
 - 회원가입1.5 (secret 재생성)
 - 회원가입2 (secret 비교)
 - 스케쥴 불러오기
 - 스케쥴 관리(추가)
 - 스케쥴 관리(변경)
 - 스케쥴 관리(삭제)
*/

router.get("/alluser", async (req, res) => {
    const users = await prisma.user.findMany({
        where: { banned: false },
    });
    res.json(users);
});

// 로그인 (api 원칙이 회원가입 2단계랑 충돌하는 중)
router.get("/auth/:email/:password", async (req, res) => {
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
router.post("/user/:email", async (req, res) => {
    const email = req.params.email;
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
                // 메일 발송 성공 여부에 따라 가지치기 해야함
                sendMail(`${email}@yonsei.ac.kr`, secret);
                response.success = true;
                response.message = `인증 메일이 ${email}@yonsei.ac.kr 로 발송되었습니다`;
            }
        } else {
            await prisma.user.create({
                data: {
                    email,
                    verificationSecret: secret,
                },
            });
            // TODO
            // 메일 발송 성공 여부에 따라 가지치기 해야함
            sendMail(`${email}@yonsei.ac.kr`, secret);
            response.success = true;
            response.message = `인증 메일이 ${email}@yonsei.ac.kr 로 발송되었습니다`;
        }
        res.json(response);
    } catch (err) {
        console.log(err);
        response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
        res.json(response);
    }
});

// 회원가입2단계 (secret 비교)
router.get("/user/:email/:givenSecret", async (req, res) => {
    const email = req.params.email;
    const givenSecret = req.params.givenSecret;
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
router.put("/user/:email/:givenPassword", async (req, res) => {
    const email = req.params.email;
    const givenPassword = req.params.givenPassword;
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

// 스케쥴 불러오기
router.get("/schedule/:email", async (req, res) => {
    console.log("");
});

// 스케쥴 관리(추가)
router.post("/schedule/:email/:content", async (req, res) => {
    console.log("");
});

// 스케쥴 관리(변경)
router.put("/schedule", async (req, res) => {
    console.log("");
});

// 스케쥴 관리(삭제)
router.delete("/schedule", async (req, res) => {
    console.log("");
});

module.exports = router;
