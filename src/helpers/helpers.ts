import { regexDigits } from "./regexHelpers";
import multer, { diskStorage } from "multer";
import fs from "fs";
import { Request } from "express";
import path from "path";

export const isGenericPhoneNumber = (value: string) => {
  return regexDigits.number.test(value);
};
export const replaceWhiteSpaces = (str: string) => str.replace(/\s/g, "");

// we can use generate  storage function whenever we want: make sure to pass a string which is  path
export const generateStorage = (destinationPath: string) => {
  const storage = diskStorage({
    destination: (req, file, cb) => {
      // Create the destination directory if it doesn't exist
      fs.mkdirSync(destinationPath, { recursive: true });
      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      // removing the whitespace and take the first array element exclude the second which is like .ext
      // appending the current date-time and append the original file name
      cb(
        null,
        replaceWhiteSpaces(file.originalname.split(".")[0]) +
          "_" +
          Date.now() +
          path.extname(file.originalname) // taking extension name from the file 
      );
    },
  });

  return storage;
};
