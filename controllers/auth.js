const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsExtra = require("fs-extra");
const path = require("path");
const jimp = require("jimp");
const gravatar = require("gravatar");
const { User } = require("../models/user");
const httpError = require("../helpers/httpError");
const avatarsDir = path.resolve("public", "avatars");
const uniqid = require("uniqid");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    if (user) {
      throw httpError(409, "Email is already in use.");
    }

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const passwordCompare = await bcrypt.compare(password, user.password);
    const errorMessage = "Email or password is wrong!";
    const payload = { id: user._id };
    const { SECRET_KEY } = process.env;
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    if (!user) {
      throw httpError(401, errorMessage);
    }

    if (!passwordCompare) {
      throw httpError(401, errorMessage);
    }

    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

const logOut = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json({ message: "Not authorized." });
  } catch (error) {
    next(error);
  }
};

const patchSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(_id, req.body, { new: true });

    if (!result) {
      throw httpError(404, "Not found");
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw next(httpError(400, "No image file attached."));
    }

    const { _id } = req.user;
    const tmpUpload = req.file.path;
    const uniqPfx = uniqid();
    const fileName = `${uniqPfx}_${req.file.originalname}`;
    const resultUpload = path.join(avatarsDir, fileName);
    const image = await jimp.read(tmpUpload);

    await image.resize(250, 250).writeAsync(resultUpload);
    await fsExtra.move(tmpUpload, resultUpload, { overwrite: true });

    const avatarURL = path.join("public", "avatars", fileName);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  logIn,
  getCurrent,
  logOut,
  patchSubscription,
  updateAvatar,
};
