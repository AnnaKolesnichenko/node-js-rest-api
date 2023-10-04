import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import path from "path";
import fs from "fs/promises";
import jimp from 'jimp';
import gravatar from "gravatar";
import { nanoid } from 'nanoid';
import sendEmail from '../helpers/sendEmail.js';

const {JWT_SECRET} = process.env;

const signup = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email is in use")
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const posterUrl = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "identicon",
    })

    const verificaitonCode = nanoid();
    const newUser = await User.create({...req.body, password: hashPassword, posterUrl, verificaitonCode});
    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${verificaitonCode}">Click here to verify</a>`
    }
    await sendEmail(verifyEmail);
    
    res.status(201).json({
        email: newUser.email, 
        subscription: newUser.subscription,
        posterUrl: newUser.poster
    })
};

const verification = async (req, res) => {
    const {verificaitonCode} = req.params;
    const user = await User.findOne({verificaitonCode});
    if(!user) {
        throw HttpError(404);
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificaitonCode: ''});

    res.json({
        message: "Email verify success";
    })
};

const verifyResend = () => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(404, "Email not found");
    }
    if(user.verify) {
        throw HttpError(400, 'Email already verified');
    }

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${user.verificaitonCode}">Click here to verify</a>`
    }
    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email resend"
    })
}

const signin = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, 'User is not verified');
    }

    if(!user.verify) {
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
};

const avatars = async (req, res) => {
    const { _id: userId } = req.user;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    try {
      const uniqueName = `${userId}_${Date.now()}${path.extname(
        req.file.originalname
      )}`;
      const publicAvatars = path.join(process.cwd(), "public/avatars");
      const avatarPath = path.join(publicAvatars, uniqueName);
      const imagePath = req.file.path;
      const image = await jimp.read(imagePath);
      await image.resize(200, 200);
      await image.writeAsync(imagePath);
      await fs.rename(imagePath, avatarPath);
      const avatarURL = `/avatars/${uniqueName}`;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatarURL },
        { new: true }
      );
      res.status(200).json({ updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

export default {
    signup,
    signin,
    getCurrent, 
    signOut, 
    verification,
    avatars, 
    verifyResend
}
