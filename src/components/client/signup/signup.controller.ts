import {Request, Response} from "express";
import {getRepository} from "typeorm";
import ISignupDTO, {AccountType, IVerifyEmail} from "./signup.dto";
import Clients from "../../../entity/Clients";
import Accounts from "../../../entity/Accounts";
import bcrypt from "bcryptjs";
import sendEmail from "../../../utils/sendEmail";

export const clientSignUp = async (req: Request, res: Response) => {

    try {

        const {fullName, email, password, accountType} = <ISignupDTO>req.body;

        let checkIfUserAlreadyRegistered = await getRepository(Clients)
            .createQueryBuilder("client")
            .where("email = :email", {email})
            .getCount();

        if (!checkIfUserAlreadyRegistered) {

            let verificationOTP = (Math.floor(Math.random() * 9000) + 1000).toString();
            let hashPassword = await bcrypt.hash(password, 10);

            let generateAccountNo = (Math.floor(Math.random() * 900000) + 100000).toString();

            let createClientAccount = await getRepository(Accounts)
                .createQueryBuilder()
                .insert()
                .values({
                    accNumber: generateAccountNo,
                    balance: 0.00,
                    accountTypeId: accountType,
                    accountStatusId: 2
                }).execute()

            let createNewClient = await getRepository(Clients)
                .createQueryBuilder()
                .insert()
                .values({
                    fullName: fullName,
                    email: email,
                    password: hashPassword,
                    verificationOtp: verificationOTP,
                    accountsId: createClientAccount.raw.insertId
                }).execute();

            let sendVerificationEmail = await sendEmail({
                to: email,
                from: 'registration@abcbank.com',
                subject: 'Email Verification',
                body: `Your OTP to verify you email is ${verificationOTP}`
            });

            return res.status(200).json({
                message: "SignUp Successful. Please verify your email address.",
                developmentHint: sendVerificationEmail
            });

        } else {

            return res.status(400).json({
                message: "An account already exists with the provided email."
            });

        }

    } catch (e) {

        console.log(e);

        return res.status(500).json({message: "Internal server error."});
    }

};


export const verifyEmail = async (req: Request, res: Response) => {

    try {

        const { email, otp} = <IVerifyEmail>req.body;


        let fetchUser = await getRepository(Clients)
            .createQueryBuilder("client")
            .where("email = :email", {email})
            .select([
                "client.id",
                "client.email",
                "client.verificationOtp"
            ])
            .getOne();

        console.log(fetchUser);

        if (fetchUser) {

            if (fetchUser.verificationOtp == otp){

                await getRepository(Clients)
                    .createQueryBuilder("client")
                    .update()
                    .set({
                        emailVerified: true
                    })
                    .where("email = :email", {email})
                    .execute();

                return res.status(200).json({
                    message: "Email verified successfully. Your application is under review.",
                });

            } else {

                return res.status(400).json({
                    message: "Invalid OTP provided, please try again."
                });

            }

        }else {

            return res.status(400).json({
                message: "Provided email not found in our records."
            });

        }

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

}
