const express = require("express");
const userCtrls = require("../../controllers/auth");
const validateBody = require("../../middlewares/validateBody");
const authenticate = require("../../middlewares/authenticate");
const userSchemas = require("../../models/user");
const router = express.Router();

router.post(
  "/register",
  validateBody(userSchemas.registerSchema),
  userCtrls.register
);
router.post("/login", validateBody(userSchemas.logInSchema), userCtrls.logIn);
router.post("/logout", authenticate, userCtrls.logOut);
router.get("/current", authenticate, userCtrls.getCurrent);
router.patch(
  "/",
  authenticate,
  validateBody(userSchemas.subscriptionSchema),
  userCtrls.patchSubscription
);

module.exports = router;
