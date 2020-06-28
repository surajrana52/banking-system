import {Request, Response} from "express";
import {getRepository} from "typeorm";
import Staff from "../../../entity/Staff";
import ISignupDTO from "./signup.dto";
import bcrypt from "bcryptjs";

export const staffSignUp = async (req: Request, res: Response) => {

    try {

        const {username, password } = <ISignupDTO>req.body;

        let checkIfUserAlreadyRegistered = await getRepository(Staff)
            .createQueryBuilder("staff")
            .where("username = :username", {username})
            .getCount();

        if (!checkIfUserAlreadyRegistered) {

            let hashPassword = await bcrypt.hash(password, 10);

            let createClientAccount = await getRepository(Staff)
                .createQueryBuilder()
                .insert()
                .values({
                    username: username,
                    password: hashPassword
                }).execute()

            return res.status(200).json({
                message: "SignUp Successful.",
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
