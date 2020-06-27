import {Router} from "express";
import requestValidator from "../middlewares/validation/joiValidator";
import {signupController, signupSchema} from '../components/staff/signup';
import {loginController, loginSchema} from "../components/staff/login";

const router: Router = Router();

router.post('/signup', requestValidator(signupSchema.schema), signupController.staffSignUp);

router.post('/login', requestValidator(loginSchema.schema), loginController.staffLogin);

export default router;
