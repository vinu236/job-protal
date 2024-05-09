import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
export const ValidateLoginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be at least 8 characters long")
      .isLength({ min: 8 })
      .run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array(),
        success: false,
        message: "Invalid Request parameters",
      });
    next();
  } catch (err) {
    next(err);
  }
};

export const ValidateForgetPasswordMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("email", "Email is not valid").isEmail().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array(),
        success: false,
        message: "Invalid Request parameters",
      });
    next();
  } catch (err) {
    next(err);
  }
};

export const ValidateResetPasswordMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("oldPassword", "Password must be at least 8 characters long")
      .isLength({ min: 8 })
      .run(req);
    await check("newPassword", "Password must be at least 8 characters long")
      .isLength({ min: 8 })
      .run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array(),
        success: false,
        message: "Invalid Request parameters",
      });
    next();
  } catch (err) {
    next(err);
  }
};

// validation for setting the password
export const ValidatePasswordMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("newPassword", "Password must be at least 8 characters long")
      .isLength({ min: 8 })
      .run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        errors: errors.array(),
        success: false,
        message: "Invalid Request parameters",
      });
    next();
  } catch (err) {
    next(err);
  }
};
