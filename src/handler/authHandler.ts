import { ICommonResult } from "../controller/interface";
import { BadRequestError } from "../errors/badRequestError";
import { generateToken } from "../helpers/generateToken";
import { IEmail } from "../helpers/interface";
import { emailRegExp } from "../helpers/regexHelpers";
import { Company, CompanyDoc } from "../models/company";
import { IUser, User, UserDoc } from "../models/user";
import { bcryptCompare } from "../utils/bcrypt";
import { sendMail } from "../utils/sendGrid";
import hashPassword from "../helpers/bcrypt";

export const loginHandler = async (
  email: string,
  password: string
): Promise<ICommonResult> => {
  try {
    // Check if the user exists and is not deleted
    const isUserExist: UserDoc | null = await User.findOne({
      email: emailRegExp(email), // Find user by email
      isDeleted: false, // Ensure user is not deleted
    });

    // If user doesn't exist, return error response
    if (!isUserExist) {
      throw new BadRequestError("Invalid password or email", 404);
    }
    // Check if the password matches the hashed password in the database
    const matchPassword = await bcryptCompare(password, isUserExist.password);

    // If password doesn't match, return error response
    if (!matchPassword) {
      throw new BadRequestError("Invalid password or email", 404);
    }
    // Generate JWT token for the authenticated user
    const token = generateToken(isUserExist);

    // excluding the password field
    const { password: excludedPassword, ...userDataWithoutPassword } =
      isUserExist.toObject();
    // Include token in the user data object
    const userData = { ...userDataWithoutPassword, jwtToken: token };

    // Return success response with user data, message, and status code
    return {
      success: true,
      data: userData, // User data including JWT token
      message: "Successfully logged in",
      status: 200,
    };

    // const {password,...isUserExist} = userData;
  } catch (error: Error | any) {
    // If an error occurs, return generic error response
    throw new BadRequestError(
      error.message ?? "Internal server error",
      error.statusCode ?? 500
    );
  }
};
export const ForgetPasswordHandler = async (
  email: string
): Promise<ICommonResult> => {
  try {
    // Check if the JobSeeker exists and is not deleted
    const isJobSeekerExist: UserDoc | null = await User.findOne({
      email: emailRegExp(email), // Find user by email
      isDeleted: false, // Ensure user is not deleted
    });

    // Check if the company exists and is not deleted
    const isCompanyExist: CompanyDoc | null = await Company.findOne({
      email: emailRegExp(email),
      isDeleted: false,
    });

    // Declaring a variable and assigning null as its initial value, which can hold either null or either a UserDoc or a CompanyDoc
    let isUserExist: UserDoc | CompanyDoc | null = null;

    if (isJobSeekerExist) {
      isUserExist = isJobSeekerExist; // User exists and is a job seeker
    } else if (isCompanyExist) {
      isUserExist = isCompanyExist; // User exists and is a company
    }
    // if both user is not found : throw error
    if (!isUserExist) {
      throw new BadRequestError("User with Email is not found");
    }

    // if the user is exists:
    const token = generateToken(isUserExist, "20m");
    // generate link for setting password link
    const restPasswordLink: string = `${process.env.REACT_APP_USER__USER_RESET_PASSWORD}?token=${token}`;

    // Generate email for reset password ;
    const emailData: IEmail = {
      from: {
        name: "Data pool",
        email: `${process.env.CLIENT_SENDER}`,
      },
      to: isUserExist.email,
      subject: "Account verification",
      text: "Reset password",
      html: `<p>Please click the following link to reset your password:</p>
           <a href="${restPasswordLink}">Rest Password</a>`, // will remove after get the design
      isHtml: true,
    };
    await sendMail(emailData);

    return {
      success: true,
      message: "Reset link sent to your email",
      status: 200,
    };
  } catch (error: Error | any) {
    // If an error occurs, return generic error response
    throw new BadRequestError(
      error.message ?? "Internal server error",
      error.statusCode ?? 500
    );
  }
};

export const resetPasswordHandler = async (
  currentUser: UserDoc,
  newPassword: string
): Promise<ICommonResult> => {
  try {
    // checking the oldPassword is
    // for hashing the password : we use a function called hashPassword;
    const newHashedPassword = await hashPassword(newPassword);
    // checking user exists or not
    const isJobSeekerExists: UserDoc | null = await User.findOne({
      _id: currentUser._id,
      isDeleted: false,
    });
    // checking the user exists in the company
    const isCompanyExists: CompanyDoc | null = await Company.findOne({
      _id: currentUser._id,
      isDeleted: false,
    });

    // if the user is not exists in the both company and jobseeker collection => throwing error
    if (!isJobSeekerExists && !isCompanyExists) {
      throw new BadRequestError("User is not found", 404);
    }
    // if the user exists int jobSeeker
    if (isJobSeekerExists) {
      isJobSeekerExists.password = newHashedPassword;
      // if the user exists in the company
    } else if (isCompanyExists) {
      isCompanyExists.password = newHashedPassword;
    }

    // return success the if the password has been updated
    return {
      success: true,
      status: 200,
      message: "Password updated successfully",
    };
  } catch (error: Error | any) {
    throw new BadRequestError(
      error.message ?? "Internal server error",
      error.statusCode ?? 500
    );
  }
};
