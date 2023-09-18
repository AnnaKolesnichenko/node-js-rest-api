import jwt from 'jsonwebtoken';
import 'dotenv/config';
import HttpError from '../helpers/HttpError.js';
import User from '../models/User.js';

const {JWT_SECRET} = process.env;

const authenticate = async (req, res, next) => {
    const {authorization = ""} = req.body;
    const [bearer, token] = authorization.split(' ');
    if(bearer !== "Bearer") {
        return next(HttpError(401));
    }

    try {
        const {id} = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if(!user) {
            throw HttpError(401);
        }
        req.user = user;
        next();
    }
    catch {
        throw HttpError(401);
    }
}

export default authenticate;