const express = require("express");
const ctrls = require("../../controllers/contacts");
const schemas = require("../../schemas/contacts");
const { validateBody } = require("../../middlewares/validateBody");
const router = express.Router();

router.get("/", ctrls.getContactsList);
router.get("/:contactId", ctrls.getContactById);
router.post("/", validateBody(schemas.addSchema), ctrls.addContact);
router.delete("/:contactId", ctrls.deleteContact);
router.put("/:contactId", validateBody(schemas.putSchema), ctrls.updateContact);

module.exports = router;
