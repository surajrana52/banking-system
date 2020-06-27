import { Router, Request, Response } from "express";
import requestValidator from '../middlewares/validation/joiValidator';
import {signupController, signupSchema} from '../components/client/signup'

const router: Router = Router();

router.post('/signup', requestValidator(signupSchema.schema), signupController.clientSignUp);
router.patch('/signup/verify-email', requestValidator(signupSchema.schema), signupController.clientSignUp);

export default router;
