const jwt = require("jsonwebtoken");
const httpError = require("../helpers/httpError");
const { User } = require("../models/user");
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(httpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(httpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch {
    next(httpError(401));
  }
};

module.exports = authenticate;
