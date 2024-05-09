import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const bcryptCompare = (
  password: string,
  hash: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        reject(err);
        console.log(err)
      } else {
        resolve(result); // Resolve with a boolean value (true for a match, false for no match)
      }
    });
  });
};
