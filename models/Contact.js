import { Schema, model } from "mongoose";
import { handleRunValidateAndUpdate, handleSaveError } from "./hooks.js";

const contactSchema = new Schema(
  {
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
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", handleRunValidateAndUpdate);
contactSchema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
