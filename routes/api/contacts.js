const express = require("express");
const ctrls = require("../../controllers/contacts");
const schemas = require("../../models/contacts");
const validateId = require("../../middlewares/validateId");
const validateBody = require("../../middlewares/validateBody");
const router = express.Router();

router.get("/", ctrls.getContactsList);
router.get("/:contactId", validateId, ctrls.getContactById);
router.post("/", validateBody(schemas.addSchema), ctrls.addContact);
router.delete("/:contactId", validateId, ctrls.deleteContact);
router.put(
  "/:contactId",
  validateId,
  validateBody(schemas.putSchema),
  ctrls.updateContact
);
router.patch(
  "/:contactId/favorite",
  validateId,
  validateBody(schemas.patchSchema),
  ctrls.updateFavoriteContact
);

module.exports = router;
