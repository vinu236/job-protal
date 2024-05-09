import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { isGenericPhoneNumber } from "../helpers/helpers";
import { Gender } from "../models/interface";
export const ValidateRegisterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body)
    const validationArray = [
      check("email", "Email is not valid").isEmail(),
      check("fullName", "Name is required").notEmpty(),
      check("addressOne", "Address is required").notEmpty(),
      check("phone", "Phone must be a valid phone number").custom(
        isGenericPhoneNumber
      ),
      check("gender").isIn(Object.values(Gender)).withMessage("Invalid gender"),
      // professional detail checks
      check("positions", "At least one position is required").isArray({
        min: 1,
      }),
      check("positions.*.designation", "Designation is required").notEmpty(),
      check("positions.*.from", "FromDate must be a valid date").notEmpty(),
      check("positions.*.to", "ToDate  must be a valid date").notEmpty(),
      check("workExperiences", "Work experiences is required").notEmpty(),
      // optional checks
      check("referralCode").optional(),
      check("profilePic").optional(),
      check("addressTwo").optional(),
    ];

    await Promise.all(validationArray.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        success: false,
        message: "Invalid Request parameters",
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

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

export const ValidateUpdateProfileMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationArray = [
      check("email").optional().isEmail().withMessage("Email is not valid"),
      check("fullName").optional().notEmpty().withMessage("Name is required"),
      check("addressOne")
        .optional()
        .notEmpty()
        .withMessage("Address is required"),
      check("phone")
        .optional()
        .custom(isGenericPhoneNumber)
        .withMessage("Phone must be a valid phone number"),
      check("gender")
        .optional()
        .isIn(Object.values(Gender))
        .withMessage("Invalid gender"),
      check("positions")
        .optional()
        .isArray({ min: 1 })
        .withMessage("At least one position is required"),
      check("positions.*.designation")
        .optional()
        .notEmpty()
        .withMessage("Designation is required"),
      check("positions.*.from")
        .optional()
        .notEmpty()
        .withMessage("FromDate must be a valid date"),
      check("positions.*.to")
        .optional()
        .notEmpty()
        .withMessage("ToDate must be a valid date"),
      check("workExperiences")
        .optional()
        .notEmpty()
        .withMessage("Work experiences is required"),
      check("profilePic").optional(),
      check("addressTwo").optional(),
    ];

    await Promise.all(validationArray.map((validation) => validation.run(req)));
  } catch (error) {
    next(error);
  }
};
