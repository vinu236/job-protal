import { ICommonResult } from "../controller/interface";
import { BadRequestError } from "../errors/badRequestError";
import { generateToken } from "../helpers/generateToken";
import { IEmail } from "../helpers/interface";
import { Company, CompanyDoc, ICompany } from "../models/company";
import { sendMail } from "../utils/sendGrid";

export const companyRegisterHandler = async (
  companyData: ICompany
): Promise<ICommonResult> => {
  try {
    // build company
    const companyBuild: CompanyDoc = Company.builds(companyData);
    // save company details to the db
    const saveCompanyDetails = await companyBuild.save();
    // converting to object
    const plainUser = saveCompanyDetails.toObject();
    // generating token;
    const token = await generateToken(saveCompanyDetails);

    const passwordLink: string = `${process.env.REACT_APP_USER_CHANGE_PASSWORD_PATH}?token=${token}`;
    // we need to set the password after successfully submit the company Details ;
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
    throw new BadRequestError("Internal server", 500);
  }
};
