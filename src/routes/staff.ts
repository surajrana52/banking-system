import {Router} from "express";
import requestValidator from "../middlewares/validation/joiValidator";
import authentication from "../middlewares/authentication/staffAuthorization";
import {signupController, signupSchema} from '../components/staff/signup';
import {loginController, loginSchema} from "../components/staff/login";
import {accountController, accountSchema} from "../components/staff/account";
import {analyticsController, analyticsSchema} from "../components/staff/analytics";

const router: Router = Router();

router.post('/signup', requestValidator(signupSchema.schema), signupController.staffSignUp);
router.post('/login', requestValidator(loginSchema.schema), loginController.staffLogin);

router.get('/account/new-registrations', authentication, accountController.getNewRegistrations);
router.patch('/account/accept/:status/:userId', [authentication, requestValidator(accountSchema.acceptApplication)], accountController.acceptApplication);
router.get('/account/user/:userId', [authentication, requestValidator(accountSchema.getAccountByUserId)], accountController.getAccountByUserId);
router.get('/account/:accountNo', [authentication, requestValidator(accountSchema.getAccountByNumber)], accountController.getAccountByNumber);
router.get('/account', authentication, accountController.getAccounts);
router.delete('/account/:userId', [authentication, requestValidator(accountSchema.deleteAccount)], accountController.deleteAccount);
router.post('/account/deposit', [authentication, requestValidator(accountSchema.makeDeposit)], accountController.makeDeposit);

router.get('/account/transactions/:pageNo', authentication, accountController.getTransactions);

router.get('/analytics/top-spender', authentication, analyticsController.getTopSpender);
router.get('/analytics/receivable/:groupBy', [authentication, requestValidator(analyticsSchema.receivable)], analyticsController.getReceivable);

export default router;
