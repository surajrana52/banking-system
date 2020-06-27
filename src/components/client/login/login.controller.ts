import {Request, Response} from "express";
import {getRepository} from "typeorm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Clients from "../../../entity/Clients";
import ILoginDTO from "./login.dto";

export const clientLogin = async (req: Request, res: Response) => {

    try {

        const { email, password } = <ILoginDTO>req.body;

        let fetchUserDetails = await getRepository(Clients)
            .createQueryBuilder("client")
            .select([
                "client.id",
                "client.password",
            ])
            .where("email = :email", {email})
            .getOne();

        let comparePasswords = await bcrypt.compare(password, fetchUserDetails.password);

        if (comparePasswords){

            const jwtAccessToken = jwt.sign({
                    userId: fetchUserDetails.id,
                    role: "client"
                },
                process.env.JWT_SECRET_TOKEN, {
                    //expiresIn: "15m"
                }
            );

            const jwtRefreshToken = jwt.sign({
                    userId: fetchUserDetails.id,
                    role: "client"
                },
                process.env.JWT_REFRESH_TOKEN, {
                    expiresIn: "10d"
                }
            );

            await getRepository(Clients)
                .createQueryBuilder("client")
                .update()
                .set({
                    refreshToken: jwtRefreshToken
                })
                .where("email = :email", {email})
                .execute();


            return res.status(200).json({
                accessToken: jwtAccessToken,
                refreshToken: jwtRefreshToken
            });

        }else {
            return res.status(401).json({
                message: "Invalid credentials."
            });
        }

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

};
