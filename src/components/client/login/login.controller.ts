import {Request, Response} from "express";
import {getRepository} from "typeorm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Clients from "../../../entity/Clients";
import ILoginDTO, {IRefreshToken} from "./login.dto";
import {redis} from "../../../config/redis";

export const clientLogin = async (req: Request, res: Response) => {

    try {

        const {email, password} = <ILoginDTO>req.body;

        let fetchUserDetails = await getRepository(Clients)
            .createQueryBuilder("client")
            .select([
                "client.id",
                "client.password",
                "client.emailVerified",
                "client.accepted",
                "client.accountDeleted",
            ])
            .where("email = :email", {email})
            .getOne();

        if (fetchUserDetails) {

            if (!fetchUserDetails.emailVerified) {
                return res.status(400).json({
                    message: "Please verify your email address."
                });
            }

            if (!fetchUserDetails.accepted) {
                return res.status(400).json({
                    message: "Your account is under review."
                });
            }

            if (fetchUserDetails.accountDeleted) {
                return res.status(400).json({
                    message: "Your account has been deleted."
                });
            }


            let comparePasswords = await bcrypt.compare(password, fetchUserDetails.password);

            if (comparePasswords) {

                const jwtAccessToken = jwt.sign({
                        userId: fetchUserDetails.id,
                        role: "client"
                    },
                    process.env.JWT_SECRET_TOKEN, {
                        expiresIn: "30m"
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

            } else {

                return res.status(401).json({
                    message: "Invalid credentials."
                });

            }

        } else {

            return res.status(401).json({
                message: "User does not exist."
            });

        }

    } catch (e) {

        console.log(e);

        return res.status(500).json({message: "Internal server error."});
    }

};

export const refreshToken = async (req: Request, res: Response) => {

    try {

        const {accessToken, refreshToken} = <IRefreshToken>req.body;

        let decodeAccessToken: any = jwt.decode(accessToken, {complete: true});

        if (decodeAccessToken) {

            let getUserDetails = await getRepository(Clients)
                .createQueryBuilder("client")
                .select([
                    "client.id",
                    "client.refreshToken"
                ])
                .where("client.id = :id", {id: decodeAccessToken.payload.userId})
                .getOne();

            if (refreshToken == getUserDetails.refreshToken){

                const jwtAccessToken = jwt.sign({
                        userId: decodeAccessToken.payload.userId,
                        role: "client"
                    },
                    process.env.JWT_SECRET_TOKEN, {
                        expiresIn: "30m"
                    }
                );

                return res.json({
                    accessToken: jwtAccessToken
                });

            } else {

                return res.status(401).json({
                    message: "Invalid refresh token."
                });
            }

        } else {
            return res.status(400).json({
                message: "Invalid access token."
            });
        }

    } catch (e) {

        console.log(e);

        return res.status(500).json({message: "Internal server error."});
    }

}

export const logout = async (req: Request, res: Response) => {

    try {

        const { authUserId } = req.body;

        await redis.lpush("user_blocked", authUserId);

        return res.json({
            message: "Logout successful."
        })

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

}
