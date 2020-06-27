import { Router, Request, Response } from "express";

const router: Router = Router();

router.post('/login', (req: Request, res: Response) => {

    return res.json({
        message: "Successfully created."
    });

});

export default router;
