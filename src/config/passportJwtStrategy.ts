import { Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import { Request } from "express";

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
        request.body.authUserId = payload.userId;
        return done(null, true);
    }
);
