const { Schema, model } = require("mongoose");
const Joi = require("joi");
const mongooseError = require("../helpers/mongooseError");

const subscriptionType = ["starter", "pro", "business"];
const emailPattern = /^\w+([\\.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 5,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailPattern,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionType,
      default: "starter",
    },
    token: String,
  },
  { versionKey: false }
);

userSchema.post("save", mongooseError);

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required(),
  password: Joi.string().min(8).required(),
  subscription: Joi.string().valid(...subscriptionType),
});

const logInSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required(),
  password: Joi.string().min(8).required(),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionType)
    .required(),
});

const User = model("user", userSchema);

module.exports = { User, registerSchema, logInSchema, subscriptionSchema };
