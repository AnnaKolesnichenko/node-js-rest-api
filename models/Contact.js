import { Schema, model } from "mongoose";
import { handleSaveError } from "./hooks";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    favorite: {
        type: Boolean,
        default: false,
    }
}, {versionKey: false, timestamps: true});

contactSchema.post('save', handleSaveError)

const Contact = model('contact', contactSchema);

export default Contact;