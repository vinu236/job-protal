import { NextFunction, Request, Response } from "express";
import { ICommonResult } from "./interface";
import {
  ForgetPasswordHandler,
  loginHandler,
  resetPasswordHandler,
} from "../handler/authHandler";
import { BadRequestError } from "../errors/badRequestError";
import { UserDoc } from "../models/user";

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Destructure email and password from the request body
    const { email, password } = req.body;

    // Call loginHandler function with email and password
    const data: ICommonResult = await loginHandler(email, password);

    // Return success response with registered user data
    return res.status(data.status).json({
      success: data.success,
      data: data.data,
      message: data.message,
    });
  } catch (error: any) {
    next(new BadRequestError(error.message, error.statusCode));
  }
};

// forgot password controller
export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // destruct the email from the request bodies
    const { email } = req.body;

    // Call forgetPassword function with email
    const data = await ForgetPasswordHandler(email);

    // Return success response
    return res.status(data.status).json({
      success: data.success,
      message: data.message,
    });
  } catch (error: any) {
    next(new BadRequestError(error.message, error.statusCode));
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // destruct the new password from the request bodies
    const { newPassword } = req.body;

    // Accessing the current user from the jwt
    const currentUser = req.user as UserDoc;

    const data = await resetPasswordHandler(currentUser, newPassword);
    // Return success response with registered user data
    return res.status(data.status).json({
      success: data.success,
      message: data.message,
    });
  } catch (error: any) {
    next(new BadRequestError(error.message, error.statusCode));
  }
};
