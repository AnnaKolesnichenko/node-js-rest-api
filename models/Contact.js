import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: String,
    phone: String,
    email: String
});

const Contact = model('contact', contactSchema);

export default Contact;