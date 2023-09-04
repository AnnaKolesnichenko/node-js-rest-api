import express from "express";
import contactsService from '../../models/contactsController.js';
import {HttpError} from '../../helpers/helpers.js';
import Joi from "joi";

const contactsRouter = express.Router();

const contactAddSchema = Joi.object({
  name: Joi.string().required,
  email: Joi.string().required,
  phone: Joi.string().required
});


contactsRouter.get('/', async (req, res) => {
  try {
    const data = await contactsService.listContacts();
    res.json(data);
  } 
  catch(error) {
    res.status(500).json({
      message: 'Server error'
    });
  }
});

contactsRouter.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const data = await contactsService.getContactById(id);
    if(!data) {
      throw HttpError(404, 'Such contact not found');
    }
    res.json(data);
  }
  catch(error) {
    next(error);
  }
});

contactsRouter.post('/', async (req, res, next) => {
  try {
    const {error} = contactAddSchema.validate(req.body);
    if(error) {
      throw HttpError(404, 'missing required name field');
    }
    const data = await contactsService.updateContactById(id, req.body);
    if(!data) {
      throw HttpError(404, 'Such contact not found');
    }

    res.json(data);
  }
  catch(error) {
    next(error);
  }
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
  try {
    const {id} = req.params;
    res = await contactsService.removeContact(id);
    if(!data) {
      throw HttpError(404, 'Such contact not found');
    }
    
    res.status(200).json({message: "Deleted"});
  }
  catch(error) {
    next(error);
  }
})

contactsRouter.put('/:contactId', async (req, res, next) => {
  try {
    const {error} = contactAddSchema.validate(req.body);
    if(error) {
      throw HttpError(404, error.message);
    }
  }
  catch(error) {
    next(error);
  }
})

export default contactsRouter;
