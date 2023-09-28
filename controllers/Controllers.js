import HttpError from "../helpers/HttpError.js";
import cloudinary from "../helpers/cloudinary.js";
import Joi from "joi";
import Contact from "../models/Contact.js";
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';

const posterPath = path.resolve('public', 'posters');


const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const contactChangeSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const GetAll = async (req, res) => {
  const {_id: owner} = req.user;
  const {page = 1, limit = 10, favorite} = req.query;
  const skip = (page - 1) * limit;

  const personalSearch = { owner };
  if (favorite !== undefined) {
    personalSearch.favorite = favorite === "true"; 
  }

  try {
    const data = await Contact.find(personalSearch, {skip, limit}).populate('owner', "email");
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};


const GetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const personalSearch = {_id: id, owner: req.user._id}
    const data = await Contact.findOne(personalSearch);
    if (!data) {
      throw HttpError(404, "Such contact not found");
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};


const AddContact = async (req, res, next) => {
  const {_id: owner} = req.user;
  const {path: oldPath, filename} = req.file;

  const {uri: poster} = await cloudinary.uploader.upload(oldPath, {
    folder: 'posters'
  })
  await fs.unlink(oldPath);

  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "there is a missing field",
      });
    }

    const data = await Contact.create({...req.body, poster, owner});
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};


const RemoveContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const personalSearch = {_id: id, owner: req.user._id}
    const data = await Contact.findOneAndRemove(personalSearch);
    if (!data) {
      throw HttpError(404, "Such contact not found");
    }

    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

const UpdateById = async (req, res, next) => {
  try {
    const { error } = contactChangeSchema.validate(req.body);
    const contactId = req.params.contactId;
    const personalSearch = {_id: id, owner: req.user._id}

    if (error) {
      throw HttpError(404, "Missing fields");
    }

    const updatedContactById = await Contact.findOneAndUpdate(
      personalSearch,
      req.body,
      { new: true }
    );
    if (!updatedContactById) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    res.status(200).json(updatedContactById);
  } catch (error) {
    next(error);
  }
};

const UpdateFavoriteById = async (req, res, next) => {
  try {
    const { error } = updateFavoriteSchema.validate(req.body);
    const contactId = req.params.contactId;
    const personalSearch = {_id: id, owner: req.user._id}

    if (error) {
      throw HttpError(404, "Missing field favorite");
    }

    const updatedContactById = await Contact.findOnendUpdate(
      personalSearch,
      req.body,
      { new: true }
    );
    if (!updatedContactById) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    res.status(200).json(updatedContactById);
  } catch (error) {
    next(error);
  }
};

export default {
  GetAll,
  GetById,
  AddContact,
  RemoveContact,
  UpdateById,
  UpdateFavoriteById,
};
