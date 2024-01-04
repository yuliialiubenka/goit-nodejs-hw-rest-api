const httpError = require("../helpers/httpError");
const { Contact } = require("../models/contacts");

const getContactsList = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;
    let result;

    if (res.favorite === "true") {
      result = await Contact.find({ owner, favorite }, "", { skip, limit });
    } else {
      result = await Contact.find({ owner }, "", { skip, limit });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const result = await Contact.findOne({ owner, contactId });
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
    const { _id: owner } = req.user;
    const result = await Contact.create(...req.body, owner);
    if (!result) throw httpError(404, "Bad request");
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(owner, contactId);
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
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(owner, contactId, req.body, {
      new: true,
    });
    if (!result) throw httpError(404, "Not found");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateFavoriteContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(owner, contactId, req.body, {
      new: true,
    });
    if (!result) throw httpError(404, "Not found");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContactsList,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  updateFavoriteContact,
};
