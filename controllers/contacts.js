const httpError = require("../helpers/httpError");
const { Contact } = require("../models/contacts");

const getContactsList = async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findOne({ _id: contactId });
    if (!result) {
      throw httpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const result = await Contact.create(req.body);
    if (!result) throw httpError(404, "Bad request");
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      throw httpError(404, "Not found");
    }
    res.status(200).json({
      message: "Contact deleted",
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) throw httpError(404, "Not found");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateFavoriteContact = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!result) {
    throw httpError(404, "Not found");
  }

  res.status(200).json(result);
};

module.exports = {
  getContactsList,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  updateFavoriteContact,
};
