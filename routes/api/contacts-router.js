import express from "express";
import Controllers from "../../controllers/Controllers.js";
const contactsRouter = express.Router();




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
    const {name, phone, email} = req.body;
    const { error } = contactAddSchema.validate({ name, phone, email });
    if(error || !name || !phone || !email) {
      return res.status(400).json({
        message: 'there is a missing field',
    });
    }

    const data = await contactsService.addContact({name, email, phone});
    res.status(201).json(data);
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
    const contactId = req.params.contactId;
    const {name, email, phone} = req.body;
   
    if(!name || !email || !phone) {
      throw HttpError(404, 'Missing fields');
    }

    const updatedContactById = await contactsService.updateContactById(contactId, name, email, phone);
    if(!updatedContactById) {
      return res.status(404).json({
        message: 'Not Found',
    });
    }
    res.status(200).json(updatedContactById);
    
  }
  catch(error) {
    next(error);
  }
})

export default contactsRouter;
