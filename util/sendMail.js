// const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const html = (secret) => {
    return `
    <span>
        새로운 계정 생성을 위해 <b>${secret}</b>을 정확히 입력해 주세요
    </span>;
`;
};

async function sendMail(to, html) {
    const googleTransport = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: "eagloo.yonsei",
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                expires: 3600,
            },
        }),
        mailOptions = {
            from: "이글루 Eagloo <eagloo.yonsei@gmail.com>",
            to,
            subject: "이글루 회원가입 인증 메일입니다",
            html: html(secret),
        };
    try {
        await googleTransport.sendMail(mailOptions);
        googleTransport.close();
    } catch (error) {}
}

// const OAuth2Client = new OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET
// );
// OAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// const accessToken = OAuth2Client.getAccessToken();

// function html(secret) {
//     return `
//     <span>새로운 계정 생성을 위해 <b>${secret}</b>을 정확히 입력해 주세요</span>
//     `;
// }

// const sendMail = async (to, secret) => {
//     const googleTransport = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             type: "OAuth2",
//             user: "eagloo.yonsei",
//             clientId: process.env.CLIENT_ID,
//             clientSecret: process.env.CLIENT_SECRET,
//             refreshToken: process.env.REFRESH_TOKEN,
//             accessToken,
//             expires: 3600,
//         },
//     });
//     const mailOptions = {
//         from: "이글루 Eagloo <eagloo.yonsei@gmail.com>",
//         to,
//         subject: "이글루 인증 메일입니다",
//         html: html(secret),
//     };

//     await googleTransport.sendMail(mailOptions);
//     googleTransport.close();
// };

// module.exports = sendMail;
