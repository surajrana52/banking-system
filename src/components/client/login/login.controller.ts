import {Request, Response} from "express";
import {getRepository} from "typeorm";
import jwt from "jsonwebtoken";
import Clients from "../../../entity/Clients";
import ILoginDTO from "./login.dto";

export const clientLogin = async (req: Request, res: Response) => {

    try {

        const { email, password } = <ILoginDTO>req.body;

        let fetchUserDetails = await getRepository(Clients)
            .createQueryBuilder("client")
            .where("email = :email", {email})
            .getOne();

        const jwtAccessToken = jwt.sign({
                userId: fetchUserDetails.id,
                role: "client"
            },
            process.env.JWT_SECRET_TOKEN, {
                expiresIn: "15m"
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

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

};
