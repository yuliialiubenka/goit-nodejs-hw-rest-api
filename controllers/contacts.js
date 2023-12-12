const contactsMethods = require("../models/contacts");
const { httpError } = require("../helpers/httpError");

const getContactsList = async (req, res, next) => {
  try {
    const result = await contactsMethods.listContacts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsMethods.getContactById(contactId);
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
    const result = await contactsMethods.addContact(req.body);
    if (!result) throw httpError(404, "Bad request");
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsMethods.removeContact(contactId);
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
    const result = await contactsMethods.updateContact(contactId, req.body);
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
};
