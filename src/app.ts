import { config } from "dotenv";
config({ path: '.env' });
import express, {Request} from "express";
import morgan from "morgan";
import passportJwtStrategy from "./config/passportJwtStrategy";
import clientRoutes from './routes/client';
import passport from "passport";

const app = express();

passport.use('default', passportJwtStrategy);
app.disable('x-powered-by');
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

morgan.token('body', function (req: Request) { return JSON.stringify(req.body) });

app.use(morgan(':method :url :remote-addr :body :status :response-time ms'));

app.use('/api/v1', clientRoutes);

export default app;
