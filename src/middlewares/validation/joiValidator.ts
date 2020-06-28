import {NextFunction, Request, Response} from "express";

export default (schema: any) => {

    return async (req: Request, res: Response, next: NextFunction) => {

        try {

            const promises =  ['params', 'query', 'body', 'files', 'file'].map(async (key: string) => {
                if (schema[key]) {
                    await schema[key].validateAsync( (req as any)[key], {
                        abortEarly: false,
                        allowUnknown: true
                    });
                }
            })

            await Promise.all(promises);

            return next();

        } catch (e) {

            let validationErrors = e.details.map((error: any) => {
                return {
                    message: error.message
                }
            });

            return res.status(400).json({
                validationError: true,
                errors: { validationErrors }
            });
        }
    }
}
