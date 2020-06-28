import {Router} from "express";
import requestValidator from '../middlewares/validation/joiValidator';
import authentication from "../middlewares/authentication/clientAuthorization";
import {signupController, signupSchema} from '../components/client/signup';
import {loginController, loginSchema} from '../components/client/login';
import {accountController, accountSchema} from '../components/client/account';

const router: Router = Router();

router.post('/signup', requestValidator(signupSchema.schema), signupController.clientSignUp);
router.patch('/signup/verify-email', requestValidator(signupSchema.verifyEmailSchema), signupController.verifyEmail);

router.post('/login', requestValidator(loginSchema.schema), loginController.clientLogin);
router.post('/login/refresh-token', loginController.refreshToken);
router.post('/logout', authentication, loginController.logout);

router.get('/account', authentication, accountController.getAccountDetails);
router.get('/account/transactions', authentication, accountController.getAccountTransactions);

router.post('/withdrawal', authentication, accountController.makeWithdrawal);
router.post('/deposit', authentication, accountController.makeDeposit);

export default router;
