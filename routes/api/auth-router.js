import express from "express";
// import * as userSchema from '../../models/User.js';
// import isValidId from "../../middleware/isValidId.js";
import AuthControllers from "../../controllers/AuthControllers.js";
import authenticate from "../../middleware/authenticate.js";

const signUpSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().pattern(emailPattern).required(),
    password: Joi.string().min(6).required()
});

const signInSchema = Joi.object({
    email: Joi.string().pattern(emailPattern).required(),
    password: Joi.string().min(6).required()
});

const authRouter = express.Router();

authRouter.post('/signup', signUpSchema, AuthControllers.signup);

authRouter.post('/signin', signInSchema, AuthControllers.signin);

authRouter.get('/current', authenticate, AuthControllers.getCurrent);

authRouter.post('/signout', authenticate, AuthControllers.signout);

export default authRouter;