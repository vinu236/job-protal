import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";
import multer from "multer";
import { MulterErrorCode } from "../utils/multerConfig";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // checking
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send(err.serializeError());
  }
  // multer error : for handling the file error
  if (err instanceof multer.MulterError) {
    if (err.code === MulterErrorCode.fileSizeLimit) {
      return res.status(400).send({ message: "File is too large" });
    }
    if (err.code === MulterErrorCode.fileCountLimit) {
      return res.status(400).send({ message: "File count is reached" });
    }
  }

  res.status(500).send({
    message: "Internal server error",
  });
};
