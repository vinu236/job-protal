import bcrypt from "bcryptjs";
import { BadRequestError } from "../errors/badRequestError";

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    // Compare the plain password with the hashed password
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new BadRequestError("Something went wrong", 500); // Rethrow the error for handling at a higher level
  }
}

async function hashPassword(password: string) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new BadRequestError("Something went wrong", 500);
  }
}

export default hashPassword;
