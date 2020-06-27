import nodemailer from 'nodemailer';
import IEmail from "../interfaces/IEmail";

export default async (emailData: IEmail) => {

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    let info = await transporter.sendMail({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.body,
    });

    return nodemailer.getTestMessageUrl(info)
}
