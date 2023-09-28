import { Schema, model } from "mongoose";
import { handleSaveError, handleRunValidateAndUpdate } from "./hooks.js";

const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
 
        password: {
          type: String,
          required: [true, 'Password is required'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          match: emailPattern,
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        token: {
          type: String,
          default: null,
        },
        poster: {
          type: String,
          required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
          }

}, {versionKey: false, timestamps: true});

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", handleRunValidateAndUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);


const User = model('user', userSchema);
export default User;