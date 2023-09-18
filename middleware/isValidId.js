import isValidObjectId from "mongoose";
import HttpError from "../helpers/HttpError.js";

const isValidId = (req, res, next) => {
  const { id } = req.body;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `id ${id} is not. avalid one`));
  }
  next();
};

export default isValidId;
