const express = require("express");
const userCtrls = require("../../controllers/auth");
const validateBody = require("../../middlewares/validateBody");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");
const userSchemas = require("../../models/user");
const router = express.Router();

router.post(
  "/register",
  validateBody(userSchemas.registerSchema),
  userCtrls.register
);
router.get("/verify/:verificationToken", userCtrls.verificationToken);
router.post(
  "/verify",
  validateBody(userSchemas.emailSchema),
  userCtrls.resendVerifyEmail
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
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  userCtrls.updateAvatar
);

module.exports = router;
