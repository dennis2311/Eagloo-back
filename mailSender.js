const nodemailer = require("nodemailer");

async function mailSender(email, secret) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GOOGLE_ID,
            pass: process.env.GOOGLE_PW,
        },
    });

    let info = await transporter.sendMail({
        from: `"연세대 사이버 독서실 이글루"<${process.env.GOOGLE_ID}>`,
        to: email,
        subject: "이글루 회원가입 인증 단어를 발송해드립니다",
        text: secret,
        html: `<b>${secret}</b>`,
    });
}

mailSender("dennis2311@yonsei.ac.kr", "화려한 물통").catch(console.error);

module.exports = mailSender;
