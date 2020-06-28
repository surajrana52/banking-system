import { Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import { Request } from "express";
import {redis} from "./redis";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_TOKEN,
    passReqToCallback: true,
};

type PayloadProps = {
    userId: string;
    role: string
};

export default new Strategy(
    jwtOptions,
    (request: Request, payload: PayloadProps, done: VerifiedCallback) => {

        const result = redis.lrange('user_blocked',0,-1).then((blockList: any) => {

            let userIdToBeChecked = payload.userId.toString();

            if (blockList.includes(userIdToBeChecked)){
                return done(true);
            }else {
                request.body.authUserId = payload.userId;
                request.body.authUserRole = payload.role;
                return done(null, true);
            }

        });
    }
);
