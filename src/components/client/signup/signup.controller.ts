import {Request, Response} from "express";
import {getRepository} from "typeorm";
import ISignupDTO, {AccountType} from "./signup.dto";
import Clients from "../../../entity/Clients";
import Accounts from "../../../entity/Accounts";
import bcrypt from "bcryptjs";

export const clientSignUp = async (req: Request, res: Response) => {

    try {

        const { email, password, accountType } = <ISignupDTO>req.body;

        let checkIfUserAlreadyRegistered =  await getRepository(Clients)
            .createQueryBuilder("client")
            .where("email = :email", {email})
            .getCount();

        if (!checkIfUserAlreadyRegistered) {

            let hashPassword = await bcrypt.hash(password,10);

            let generateAccountNo = (Math.floor(Math.random() * 90000) + 10000).toString();

            let createClientAccount = await getRepository(Accounts)
                .createQueryBuilder()
                .insert()
                .values({
                    accNumber: generateAccountNo,
                    balance: 0.00,
                    accountTypeId: accountType,
                    accountStatusId: 2
                }).execute()

            console.log(createClientAccount);

            let createNewClient = await getRepository(Clients)
                .createQueryBuilder()
                .insert()
                .values({
                    email: email,
                    password: hashPassword,
                    accountsId: createClientAccount.raw.insertId
                }).execute()

            return res.status(200).json({
                message: "SignUp Successful. Please verify your email address."
            });

        }else {

            return res.status(400).json({
                message: "An account already exists with the provided email."
            });

        }

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

};
