import {Request, Response, NextFunction} from "express";

const validateContentType = (headers: { [key:string]: any}) => {

    const allowedContentType = ["application/json"];

    const contentType = headers['content-type'].split(';')[0]

    return !!allowedContentType.includes(contentType);
}

export default (req: Request, res: Response, next: NextFunction) => {

    const excludeMethods = ["GET","DELETE"];

    if (!excludeMethods.includes(req.method)){

        if(!validateContentType(req.headers)) {

            return res.status(406).json({
                message: "Invalid content-type"
            })

        }

    }

    return next();
}
