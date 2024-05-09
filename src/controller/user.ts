import { profileUpdateHandler, registerHandler } from "../handler/userHandler";
import { IUser, UserDoc } from "../models/user";
import { NextFunction, Request, Response } from "express";
import { ICommonResult } from "./interface";
import { BadRequestError } from "../errors/badRequestError";

// Handler for user registration endpoint
export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract user data from request body
    const userData: IUser = req.body;

    // Call registerHandler function to register user
    const data: ICommonResult = await registerHandler(userData);
    // Return success response with registered user data
    return res.status(data.status).json({
      success: data.success,
      data: data.data,
      message: data.message,
    });
  } catch (error: Error | any) {
    // If an error occurs, log the error

    next(new BadRequestError(error.message, error.status));
  }
};

export const profileUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUser = req.user as UserDoc;
    const profileDataToUpdate = req.body;

    const data: ICommonResult = await profileUpdateHandler(
      currentUser,
      profileDataToUpdate
    );

    return res.status(data.status).json({
      data: data,
      success: data.success,
      message: data.message,
    });
  } catch (error: Error | any) {
    next(new BadRequestError(error.message, error.status));
  }
};
