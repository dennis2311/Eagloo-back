const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const dotenv = require("dotenv");
dotenv.config();

const OAuth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

OAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

function html(secret) {
    return `
    <span>
        새로운 계정 생성을 위해 <b>${secret}</b>을 정확히 입력해 주세요
    </span>;
`;
}

async function sendMail(to, secret) {
    const accessToken = OAuth2Client.getAccessToken();

    const googleTransport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: "eagloo.yonsei@gmail.com",
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken,
                expires: 3600,
            },
        }),
        mailOptions = {
            from: "이글루 Eagloo <eagloo.yonsei@gmail.com>",
            to: `${to}@yonsei.ac.kr`,
            subject: "이글루 회원가입 인증 메일입니다",
            html: html(secret),
        };

    try {
        await googleTransport.sendMail(mailOptions);
        googleTransport.close();
    } catch (error) {
        console.log(`${to}@yonsei.ac.kr 메일 전송에 실패하였습니다`);
        console.log(error);
    }
}

module.exports = sendMail;
