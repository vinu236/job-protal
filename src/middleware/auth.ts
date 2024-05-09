import { NextFunction, Request, Response } from "express";
import { User, UserDoc } from "../models/user";
import { emailRegExp } from "../helpers/regexHelpers";
import { BadRequestError } from "../errors/badRequestError";
import { comparePasswords } from "../helpers/bcrypt";
import { Company, CompanyDoc } from "../models/company";
export const checkUserWithEmailExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, phone } = req.body;
    // Define the queries for email and phone separately
    const emailQuery = { email: emailRegExp(email) };
    const phoneQuery = { phone };
    // Check if a user with the provided email or phone number already exists
    const isJobSeekerExist: UserDoc | null = await User.findOne({
      isDeleted: false,
      $or: [emailQuery, phoneQuery], // Use $or operator to check for either email or phone
    });

    const isCompanyExist: CompanyDoc | null = await Company.findOne({
      isDeleted: false,
      $or: [emailQuery, phoneQuery], // Use $or operator to check for either email or phone
    });

    let isUserExist;
    if (isJobSeekerExist) {
      isUserExist = isJobSeekerExist;
    } else if (isCompanyExist) {
      isUserExist = isCompanyExist;
    }
    // If a user with the provided email or phone number exists
    if (isUserExist) {
      // If the existing user's phone number matches the provided phone number
      if (isUserExist.phone === phone) {
        next(new BadRequestError("User with phone number already exists")); // Throw error for existing phone number
      } else {
        next(new BadRequestError("User with email already exists", 409)); // Throw error for existing email
      }
    }
    next();
  } catch (error: Error | any) {
    return next(error);
  }
};

export const checkPasswordComparisonMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // destruct the new password from the req bodies
    const { oldPassword } = req.body;

    // getting the user from the jwt
    const user = req.user as UserDoc;
    // getting the jobseeker details and take the password for comparison
    const jobSeekerDetails: UserDoc | null = await User.findOne({
      _id: user._id,
    });
    // getting the company details and take the password for comparison
    const companyDetails: CompanyDoc | null = await Company.findOne({
      _id: user._id,
    });

    // Declare a variable to hold user details, initialized as null
    let userDetails: UserDoc | CompanyDoc | null = null;

    // Check if job seeker details exist
    if (jobSeekerDetails) {
      // If job seeker details exist, assign them to userDetails
      userDetails = jobSeekerDetails;
    } else if (companyDetails) {
      // If job seeker details don't exist but company details exist,
      // assign company details to userDetails
      userDetails = companyDetails;
    }
    // if userDetails exists throw error user not found;
    if (!userDetails) {
      throw new BadRequestError("User not found", 404);
    }
    //comparing the old password with new password;
    const isComparedSuccess = comparePasswords(
      oldPassword,
      userDetails.password
    );

    // if comparison failed throwing error:
    if (!isComparedSuccess) {
      throw new BadRequestError("Password is not matching", 404);
    }
    next();
  } catch (error: Error | any) {
    next(new BadRequestError(error.message, error.statusCode));
  }
};
