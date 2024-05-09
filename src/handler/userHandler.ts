import { IUser, User, UserDoc } from "../models/user";
import { generateToken } from "../helpers/generateToken";
import { emailRegExp } from "../helpers/regexHelpers";
import { bcryptCompare } from "../utils/bcrypt";
import { ICommonResult } from "../controller/interface";
import { BadRequestError } from "../errors/badRequestError";
import { IEmail } from "../helpers/interface";
import dotenv from "dotenv";
import { sendMail } from "../utils/sendGrid";
import { Company, CompanyDoc } from "../models/company";
import { CustomError } from "../errors/custom-error";
dotenv.config();
export const registerHandler = async (
  userData: IUser
): Promise<ICommonResult> => {
  try {
    // building the user
    const user: UserDoc = User.build(userData);
    // before saving the user doc , pre hook work to hash the password
    // after that => save to db
    // Save the user document to the database
    const createdUser = await user.save();
    // Convert the created user to a plain JavaScript object
    const plainUser = createdUser.toObject();
    // after  saving the user doc =>generate a jwt token and sent it to user
    // calling a function called generate Token =>To get a jwt token
    const token = generateToken(createdUser);

    // generate link for setting password link
    const passwordLink = `${process.env.REACT_APP_USER_CHANGE_PASSWORD_PATH}?token=${token}`;

    // we need to set the password after successfully submit the user Details ;
    // Generate email for password setting
    const emailData: IEmail = {
      from: {
        name: "Data pool",
        email: `${process.env.CLIENT_SENDER}`,
      },
      to: plainUser.email,
      subject: "Account verification",
      text: "Please set your password",
      html: `<p>Please click the following link to set your password:</p>
      <a href="${passwordLink}">Set Password</a>`, // will remove after get the design
      isHtml: true,
    };
    await sendMail(emailData);

    // modify the data;
    const modifiedData = { email: plainUser.email };
    // sending the response
    return {
      success: true,
      message: "Form Submission Success",
      data: modifiedData,
      status: 200,
    };
  } catch (error) {
    throw new BadRequestError("Could not create the account", 500);
  }
};

export const profileUpdateHandler = async (
  currentUser: UserDoc,
  profileData: UserDoc
): Promise<ICommonResult> => {
  try {
    // updating the user profile data
    const updateUserProfileData = await User.findOneAndUpdate(
      { _id: currentUser._id },
      { $set: profileData },
      { new: true }
    ).lean();

    // updating is not success : throw error
    if (!updateUserProfileData) {
      throw new BadRequestError("Could not update the profile", 404);
    }
    // return response:
    return {
      success: true,
      status: 200,
      data: updateUserProfileData,
      message: "Updated successfully",
    };
  } catch (error: any) {
    throw new BadRequestError(
      error.message ?? "Internal server error",
      error.statusCode ?? 500
    );
  }
};
