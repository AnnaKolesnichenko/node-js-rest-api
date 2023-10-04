import Joi from 'joi';

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

const userEmailSchema = () => {
    Joi.object({
        email: Joi.string().pattern(emailPattern).required(),
    });
}

const validateSignUp = (req, res, next) => {
    const { error } = signUpSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

const validateSignIn = (req, res, next) => {
    const { error } = signInSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateEmail = (req, res, next) => {
    const { error } = userEmailSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};



export {
    validateSignIn,
    validateSignUp,
    validateEmail
}