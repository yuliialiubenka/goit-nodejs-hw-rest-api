const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsExtra = require("fs-extra");
const path = require("path");
const jimp = require("jimp");
const gravatar = require("gravatar");
const { User } = require("../models/user");
const httpError = require("../helpers/httpError");
const sendEmail = require("../helpers/sendEmail");
const avatarsDir = path.resolve("public", "avatars");
const uniqid = require("uniqid");
const { BASE_URL } = process.env;

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uniqid();

    if (user) {
      throw httpError(409, "Email is already in use.");
    }

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Thank you for registering!</h2>
                <p style="color: #666;">Please confirm your registration by clicking the link below:</p>
        
                <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; margin-top: 20px; border-radius: 5px;">Confirm Registration</a>
        
                <p style="color: #666; margin-top: 20px;">If you did not register on our website, please disregard this email.</p>
            </div>
          `,
    };

    await sendEmail(verifyEmail);

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

    if (!user.verify) {
      throw httpError(401, "Email is not verified!");
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

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw httpError(404, "User not found");

  if (user.verify) throw httpError(404, "Verification has already been passed");

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Thank you for registering!</h2>
                <p style="color: #666;">Please confirm your registration by clicking the link below:</p>
        
                <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; margin-top: 20px; border-radius: 5px;">Confirm Registration</a>
        
                <p style="color: #666; margin-top: 20px;">If you did not register on our website, please disregard this email.</p>
            </div>
          `,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
};

const verificationToken = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    res.status(404).json({ message: "User was not found." });
  }
  await User.findByIdAndUpdate(user.id, {
    verificationToken: null,
    verify: true,
  });
  res
    .status(200)
    .json({ message: "Verification has been successfully completed." });
};

module.exports = {
  register,
  logIn,
  getCurrent,
  logOut,
  patchSubscription,
  updateAvatar,
  resendVerifyEmail,
  verificationToken,
};
