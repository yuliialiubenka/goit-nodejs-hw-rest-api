const { httpError } = require("../helpers/httpError");

const validateBody = (schema) => {
  const validation = (req, res, next) => {
    // console.log(schema);
    const { error } = schema.validate(req.body);

    if (error) {
      next(httpError(400, error.message));
    }
    next();
  };

  return validation;
};

module.exports = { validateBody };
