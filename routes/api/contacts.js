const express = require("express");
const ctrls = require("../../controllers/contacts");
const schemas = require("../../models/contacts");
const validateId = require("../../middlewares/validateId");
const validateBody = require("../../middlewares/validateBody");
const authenticate = require("../../middlewares/authenticate");
const router = express.Router();

router.get("/", authenticate, ctrls.getContactsList);
router.get("/:contactId", authenticate, validateId, ctrls.getContactById);
router.post(
  "/",
  authenticate,
  validateBody(schemas.addSchema),
  ctrls.addContact
);
router.delete("/:contactId", authenticate, validateId, ctrls.deleteContact);
router.put(
  "/:contactId",
  authenticate,
  validateId,
  validateBody(schemas.putSchema),
  ctrls.updateContact
);
router.patch(
  "/:contactId/favorite",
  validateId,
  authenticate,
  validateBody(schemas.patchSchema),
  ctrls.updateFavoriteContact
);

module.exports = router;
