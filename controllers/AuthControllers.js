import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const {JWT_SECRET} = process.env;

// const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


const signup = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email is in use")
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});
    res.status(201).json({
        email: newUser.email, 
        subscription: newUser.subscription
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

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, token);
   
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription
        }
    })
};

const getCurrent = (req, res) => {
    const {email, username} = req.user;
    res.json({
        email,
        username
    })
}

const signOut = async (req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ''});
    res.json({
        message: "LogOut success"
    })
}

export default {
    signup,
    signin,
    getCurrent, 
    signOut
}
