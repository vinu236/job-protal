import { sign } from "jsonwebtoken";
import { UserDoc } from "../models/user";
import { CompanyDoc } from "../models/company";

export const generateToken = (
  user: UserDoc | CompanyDoc,
  expires: string = "30d"
): any => {
  const payload = { email: user.email, _id: user._id, role: user.role };
  return sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: expires });
};
