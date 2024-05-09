// this auth.ts includes Login and forget password reset-password;
import { Router } from "express";
import {
  ValidateForgetPasswordMiddleware,
  ValidateLoginMiddleware,
} from "../validations/user";
import {
  forgetPassword,
  resetPassword as changePassword,
  userLogin,
} from "../controller/auth";
import {
  ValidatePasswordMiddleware,
  ValidateResetPasswordMiddleware,
} from "../validations/auth";
import { checkPasswordComparisonMiddleware } from "../middleware/auth";
import passport from "passport";
const router = Router();

// login router
router.post("/login", ValidateLoginMiddleware, userLogin);

// forget-password router
router.post(
  "/forget-password",
  ValidateForgetPasswordMiddleware,
  forgetPassword
);

// reset-password:
router.put(
  "/reset-password",
  ValidateResetPasswordMiddleware,
  passport.authenticate("jwt", { session: false }), // jwt auth
  checkPasswordComparisonMiddleware,
  changePassword
);

router.post(
  "/set-password",
  ValidatePasswordMiddleware,
  passport.authenticate("jwt", { session: false }), // jwt auth
  changePassword
);

export { router as authRouter };
