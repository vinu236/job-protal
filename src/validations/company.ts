import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { isGenericPhoneNumber } from "../helpers/helpers";
import { Gender } from "../models/interface";

//validate company body
export const validateCompanyBodyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationArray = [
      check("email", "Email is not valid").isEmail(),
      check("fullName", "Name is required").notEmpty(),
      check("companyName  ", "Name is required").notEmpty(),
      check("address", "Address is required").notEmpty(),
      check("gender").isIn(Object.values(Gender)).withMessage("Invalid gender"),
      check("profession", "Profession is required").isArray().notEmpty(),
      check("phone", "Phone must be a valid phone number").custom(
        isGenericPhoneNumber
      ),
      check("positions.*.designation", "Designation is required").notEmpty(),
      // optional checks
      check("profilePic").optional(),
      check("companyRole").optional(),
      check("companyName").optional(),
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
  } catch (error) {
    next(error);
  }
};
