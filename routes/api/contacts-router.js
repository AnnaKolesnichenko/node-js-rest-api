import express from "express";
import Controllers from "../../controllers/Controllers.js";

import isValidId from "../../middleware/isValidId.js";
import authenticate from "../../middleware/authenticate.js";

const contactsRouter = express.Router();
contactsRouter.get("/", authenticate, Controllers.GetAll);

contactsRouter.get("/:id", authenticate, isValidId, Controllers.GetById);

contactsRouter.post("/", authenticate, Controllers.AddContact);

// contactsRouter.delete('/:contactId', Controllers.RemoveContact)

contactsRouter.put("/:contactId", authenticate, isValidId, Controllers.UpdateById);

contactsRouter.patch("/:contactId/favorite", authenticate, isValidId, Controllers.UpdateFavoriteById);

export default contactsRouter;
