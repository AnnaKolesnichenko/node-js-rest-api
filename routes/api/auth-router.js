import express from "express";
import {validateSignIn} from '../../middleware/validateSchema.js';
import {validateSignUp} from '../../middleware/validateSchema.js';
import { validateEmail } from "../../middleware/validateSchema.js";
import AuthControllers from "../../controllers/AuthControllers.js";
import authenticate from "../../middleware/authenticate.js";

// const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


const authRouter = express.Router();

authRouter.post('/signup', validateSignIn, AuthControllers.signup);

authRouter.post('/signin', validateSignUp, AuthControllers.signin);

authRouter.get('/current', authenticate, AuthControllers.getCurrent);

authRouter.post('/signout', authenticate, AuthControllers.signOut);

authRouter.post("/verify", validateEmail, AuthControllers.verifyResend);

authRouter.get("/verify/:verificationToken", AuthControllers.verification);

export default authRouter;