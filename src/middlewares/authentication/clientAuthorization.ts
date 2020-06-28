import {Request, Response, NextFunction} from "express"
import passport from "passport";

export default (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate('default', { session: false }, async (error, token) => {

        if (error || !token || req.body.authUserRole !== 'client'){
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        return next();

    })(req, res, next);
};
