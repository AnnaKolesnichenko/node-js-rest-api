import Joi from 'joi';
import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const {JWT_SECRET} = process.env;

const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const signUpSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().pattern(emailPattern).required(),
    password: Joi.string().min(6).required()
});

const signInSchema = Joi.object({
    email: Joi.string().pattern(emailPattern).required(),
    password: Joi.string().min(6).required()
});

const signup = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email is in use")
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});
    res.status(201).json({
        username: newUser.username,
        email: newUser.email
    })
};

const signin = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, 'Email or password is invalid');
    }

    const passwordCompare = await bcryptjs.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is invalid");
    }

    const payload = {
        id: user._id,
    }
    console.log(JWT_SECRET, 'the key');
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
   
    res.json({
        token,
    })
};

const getCurrent = (req, res) => {
    const {email, password} = req.user;
}

export default {
    signup,
    signin,
    getCurrent
}
