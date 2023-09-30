import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import path from "path";
import fs from "fs/promises";
import jimp from 'jimp';
import gravatar from "gravatar";

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

    const newUser = await User.create({...req.body, password: hashPassword, posterUrl});
    res.status(201).json({
        email: newUser.email, 
        subscription: newUser.subscription,
        posterUrl: newUser.poster
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
    signOut
}
