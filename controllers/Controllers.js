import HttpError from "../helpers/HttpError.js";
import Joi from "joi";
import Contact from "../models/Contact.js";
//import contactsService from '../models/contactsController.js';

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

// const GetAll =  async (req, res) => {
//     try {
//         const data = await contactsService.listContacts();
//         res.json(data);
//     }
//     catch(error) {
//         res.status(500).json({
//         message: 'Server error'
//         });
//     }
// };
const GetAll = async (req, res) => {
  try {
    const data = await Contact.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// const GetById = async (req, res, next) => {
//     try {
//       const {id} = req.params;
//       const data = await contactsService.getContactById(id);
//       if(!data) {
//         throw HttpError(404, 'Such contact not found');
//       }
//       res.json(data);
//     }
//     catch(error) {
//       next(error);
//     }
//   };

const GetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Contact.findById({ id });
    if (!data) {
      throw HttpError(404, "Such contact not found");
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// const AddContact = async (req, res, next) => {
//   try {
//     const { error } = contactAddSchema.validate(req.body);
//     if(error) {
//       return res.status(400).json({
//         message: 'there is a missing field',
//     });
//     }

//     const data = await contactsService.addContact(req.body);
//     res.status(201).json(data);
//   }
//   catch(error) {
//     next(error);
//   }
// };

const AddContact = async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "there is a missing field",
      });
    }

    const data = await Contact.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

//   const RemoveContact = async (req, res, next) => {
//     try {
//       const {id} = req.params;
//       res = await contactsService.removeContact(id);
//       if(!data) {
//         throw HttpError(404, 'Such contact not found');
//       }

//       res.status(200).json({message: "Deleted"});
//     }
//     catch(error) {
//       next(error);
//     }
//   };

const RemoveContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    res = await contactsService.removeContact(id);
    if (!data) {
      throw HttpError(404, "Such contact not found");
    }

    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

//   const UpdateById = async (req, res, next) => {
//     try {
//       const {error} = contactChangeSchema.validate(req.body);
//       const contactId = req.params.contactId;

//       if(error) {
//         throw HttpError(404, 'Missing fields');
//       }

//       const updatedContactById = await contactsService.updateContactById(contactId, req.body);
//       if(!updatedContactById) {
//         return res.status(404).json({
//           message: 'Not Found',
//       });
//       }
//       res.status(200).json(updatedContactById);

//     }
//     catch(error) {
//       next(error);
//     }
//   };

const UpdateById = async (req, res, next) => {
  try {
    const { error } = contactChangeSchema.validate(req.body);
    const contactId = req.params.contactId;

    if (error) {
      throw HttpError(404, "Missing fields");
    }

    const updatedContactById = await Contact.findByIdAndUpdate(
      contactId,
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
};
