const { isValidObjectId } = require("mongoose");
const httpError = require("../helpers/httpError");

const validateId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId))
    next(httpError(400, `${contactId} is not valid`));
  next();
};

module.exports = validateId;
