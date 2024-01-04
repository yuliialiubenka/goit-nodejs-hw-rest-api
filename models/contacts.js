const Joi = require("joi");
const { model, Schema } = require("mongoose");
const mongooseError = require("../helpers/mongooseError");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const putSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).or("name", "email", "phone", "favorite");

const patchSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

contactSchema.post("save", mongooseError);
const Contact = model("contact", contactSchema);

module.exports = { addSchema, putSchema, patchSchema, Contact };
