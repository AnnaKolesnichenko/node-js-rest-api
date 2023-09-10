import express from "express";
import Controllers from "../../controllers/Controllers.js";
const contactsRouter = express.Router();

contactsRouter.get('/', Controllers.GetAll);

// contactsRouter.get('/:id', Controllers.GetById);

contactsRouter.post('/', Controllers.AddContact)

// contactsRouter.delete('/:contactId', Controllers.RemoveContact)

// contactsRouter.put('/:contactId', Controllers.UpdateById)

export default contactsRouter;
