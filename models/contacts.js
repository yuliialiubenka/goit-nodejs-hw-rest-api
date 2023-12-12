const fs = require("fs/promises");
const path = require("path");
const uniqid = require("uniqid");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const contactsList = await fs.readFile(contactsPath);
  return JSON.parse(contactsList);
};

const getContactById = async (contactId) => {
  const contactsList = await listContacts();
  const contact = contactsList.find((contact) => contact.id === contactId);

  return contact || null;
};

const removeContact = async (contactId) => {
  const contactsList = await listContacts();
  const indexToRemove = contactsList.findIndex(
    (contact) => contact.id === contactId
  );

  if (indexToRemove !== -1) {
    const removedContact = contactsList.splice(indexToRemove, 1)[0];
    await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
    return removedContact;
  } else {
    return null;
  }
};

const addContact = async (body) => {
  const contactsList = await listContacts();
  const { name, email, phone } = body;

  const newContact = {
    id: uniqid(),
    name,
    email,
    phone,
  };

  contactsList.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contactsList = await listContacts();
  const contactIndex = contactsList.findIndex(({ id }) => id === contactId);

  if (contactIndex !== -1) {
    contactsList[contactIndex] = { ...contactsList[contactIndex], ...body };
    await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
    return contactsList[contactIndex];
  } else {
    return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
