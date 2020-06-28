import {Request, Response} from "express";
import {getRepository} from "typeorm";
import jwt from "jsonwebtoken";
import ILoginDTO from "./login.dto";
import Staff from "../../../entity/Staff";
import bcrypt from "bcryptjs";

export const staffLogin = async (req: Request, res: Response) => {

    try {

        const { username, password } = <ILoginDTO>req.body;

        let fetchStaffDetails = await getRepository(Staff)
            .createQueryBuilder("staff")
            .select([
                "staff.id",
                "staff.password"
            ])
            .where("username = :username", {username})
            .getOne();

        if (fetchStaffDetails){

            let comparePasswords = await bcrypt.compare(password, fetchStaffDetails.password);

            if (comparePasswords){

                const jwtAccessToken = jwt.sign({
                        userId: fetchStaffDetails.id,
                        role: "staff"
                    },
                    process.env.JWT_SECRET_TOKEN, {
                        expiresIn: "1h"
                    }
                );

                return res.status(200).json({
                    accessToken: jwtAccessToken
                });

            } else {

                return res.status(401).json({
                    message: "Invalid credentials."
                });
            }

        }else {

            return res.status(401).json({
                message: "User not found."
            });

        }



    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

};
