import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/badRequestError";
import { ICompany } from "../models/company";
import { companyRegisterHandler } from "../handler/companyHandler";
import { ICommonResult } from "./interface";

// company register :
export const companyRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // taking the company data from the request body;
    const companyData: ICompany = req.body;

    // passing argument as company data to the company handler
    const data: ICommonResult = await companyRegisterHandler(companyData);

    // return response if the req is success;
    return {
      data: data.data,
      message: data.message,
      success: data.success,
      status: data.status,
    };
  } catch (error: Error | any) {
    next(new BadRequestError(error.message, error.statusCode));
  }
};
